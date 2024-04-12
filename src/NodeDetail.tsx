import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sigma } from 'sigma';
import EdgeCurveProgram, { DEFAULT_EDGE_CURVATURE, indexParallelEdgesIndex } from "@sigma/edge-curve";
import { EdgeArrowProgram } from "sigma/rendering";
import ForceSupervisor from "graphology-layout-force/worker";
import { MultiGraph } from "graphology";
import { parseString } from 'xml2js';

function NodeDetail() {
  const { nodeId: encodedNodeId} = useParams();
  const nodeId = decodeURIComponent(encodedNodeId);
  const navigate = useNavigate();
  const [recipeDetails, setRecipeDetails] = useState({ type: '', steps: [] });

  const extractRecipesAndScores = (output) => {
    const recipePattern = /\d+\.\s(.*?)\s->\s(\d+\.\d+)/g;
    let matches, recipesWithScores = [];
    while ((matches = recipePattern.exec(output)) !== null) {
      recipesWithScores.push({
        name: matches[1],
        score: matches[2],
      });
    }
    return recipesWithScores;
  };

  const outputString = localStorage.getItem("nodeOutput");
  const recipesWithScores = outputString ? extractRecipesAndScores(outputString) : [];

  const ingredientString = localStorage.getItem("ingredient");
  const togetherString = localStorage.getItem("together");
  const orderString = localStorage.getItem("order");

  const ingredient = ingredientString.split(',');
  const together = togetherString.split(',');

  const order = orderString.split(',').map(item => [item.trim()]);
  
  const container = document.getElementById("sigma-container") as HTMLElement;

  useEffect(() => {

    console.log(order)

    console.log(typeof ingredient)
    console.log(typeof order)
    console.log(typeof together)

    const graph = new MultiGraph();
    ingredient.forEach((element) => {
      graph.addNode(element, {
        x: Math.random(),
        y: Math.random(),
        size: 10,
        color: "black",
        label: element,
      });
    });

    for (let i = 0; i < order.length - 1; i++) {
      var n = i + 1;
      let stringNumber = n.toString();
      order[i].forEach((element) => {
        order[i + 1].forEach((element2) => {
          graph.addEdge(element, element2, {
            forceLabel: true,
            label: stringNumber,
            type: "curved",
          });
        });
      });
    }

    function random_walk(Graph, node, walkLength) {
      let rWalk = [node];
      for (let i = 0; i < walkLength; i++) {
        let temp = Array.from(new Set(Graph.neighbors(node)));
        temp = temp.filter((n) => !rWalk.includes(n));
        if (temp.length === 0) {
          break;
        }
        let newNode = temp[Math.floor(Math.random() * temp.length)];
        rWalk.push(newNode);
        node = newNode;
      }
      return rWalk;
    }

    graph.forEachNode((node, attributes) => {
      console.log(random_walk(graph, node, 3));
    });
    let numWalks = 100;
    let walkLength = 3;
    let nodeImportance = computeNodeImportance(
      graph,
      walkLength,
      numWalks
    );
    console.log(nodeImportance);
    graph.forEachNode((node, attributes) => {
      graph.setNodeAttribute(
        node,
        "size",
        (nodeImportance[node] || 0) * 10
      );
    });

    indexParallelEdgesIndex(graph, {
      edgeIndexAttribute: "parallelIndex",
      edgeMaxIndexAttribute: "parallelMaxIndex",
    });
    graph.forEachEdge(
      (
        edge,
        {
          parallelIndex,
          parallelMaxIndex,
        }:
          | { parallelIndex: number; parallelMaxIndex: number }
          | { parallelIndex?: null; parallelMaxIndex?: null }
      ) => {
        if (typeof parallelIndex === "number") {
          graph.mergeEdgeAttributes(edge, {
            type: "curved",
            curvature:
              DEFAULT_EDGE_CURVATURE +
              (3 * DEFAULT_EDGE_CURVATURE * parallelIndex) /
                parallelMaxIndex,
          });
        } else {
          graph.setEdgeAttribute(edge, "type", "straight");
        }
      }
    );

    function computeNodeImportance(graph, walkLength, numWalks) {
      let visitCount = {};
      graph.forEachNode((node) => (visitCount[node] = 0));

      for (let i = 0; i < numWalks; i++) {
        graph.forEachNode((node) => {
          let walk = random_walk(graph, node, walkLength);
          walk.forEach((n) => visitCount[n]++);
        });
      }

      // Normalize visit counts to determine node importance
      let maxVisits = Math.max(...Object.values(visitCount));
      let nodeImportance = {};
      graph.forEachNode((node) => {
        nodeImportance[node] = visitCount[node] / maxVisits;
      });

      return nodeImportance;
    }



    if (container) {
      var renderer = new Sigma(graph, container, {
        allowInvalidContainer: true,
            defaultEdgeType: "straight",
            renderEdgeLabels: true,
            edgeProgramClasses: {
              straight: EdgeArrowProgram,
              curved: EdgeCurveProgram}
      });
    

      return () => {
        renderer.kill();
      };
    }
  }, [nodeId]);

  useEffect(() => {
    const gexfFilePath = '/steps_test.gexf';

    fetch(gexfFilePath)
      .then(response => response.text())
      .then(gexfContent => {
        parseGexf(gexfContent);
      })
      .catch(error => {
        console.error('Error fetching GEXF file:', error);
      });
  }, [nodeId]);

  function parseGexf(gexfXml) {
    parseString(gexfXml, (err, result) => {
      if (err) {
        console.error("Error parsing GEXF:", err);
        return;
      }
      const nodes = result.gexf.graph[0].nodes[0].node;
      const targetNode = nodes.find(node => node.$.label.toLowerCase() === nodeId.toLowerCase());
      console.log(nodeId)

      if (!targetNode) {
        console.log(`No node found for ID: ${nodeId}`);
        return;
      }

      targetNode.attvalues[0].attvalue.forEach(att => {
        if (att.$.for === "2") {
          setRecipeDetails(details => ({ ...details, type: att.$.value }));
        } else if (att.$.for === "3") {
          try {
            const steps = JSON.parse(att.$.value.replace(/'/g, '"'));
            setRecipeDetails(details => ({ ...details, steps }));
          } catch (error) {
            console.error("Error parsing recipe steps:", error);
          }
        }
      });
    });
  }

  const handleRecipeClick = (nodeId) => {
    navigate(`/nodes/${encodeURIComponent(nodeId)}`);
  };

  return (
    <div>
      <h3>Recipe Name: {nodeId}</h3>
      <div>
        <h4>Type: {recipeDetails.type}</h4>
        <h5>Steps:</h5>
        <ol>
          {recipeDetails.steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </div>
      <h3>Similar Recipes:</h3>
      {recipesWithScores.length > 0 ? (
        <ul>
          {recipesWithScores.map((item, index) => (
            <li key={index}>
              <button type="button" onClick={() => handleRecipeClick(item.name)}>
                {item.name}
              </button>
              <span> (Score: {item.score})</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No similar recipes found.</p>
      )}
    </div>
  );
}

export default NodeDetail;