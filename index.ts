import Sigma from "sigma";
import Graph from "graphology";
import { parse } from "graphology-gexf/browser";
import { Coordinates, EdgeDisplayData, NodeDisplayData } from "sigma/types";

const container = document.getElementById("sigma-container") as HTMLElement;
const searchInput = document.getElementById("search-input") as HTMLInputElement;
const searchSuggestions = document.getElementById(
  "suggestions"
) as HTMLDataListElement;
const searchInput2 = document.getElementById("searchInput");
const findButton = document.getElementById("findButton");
// Load external GEXF file:
fetch("./final_507.gexf")
  .then((res) => res.text())
  .then((gexf) => {
    const container = document.getElementById("sigma-container") as HTMLElement;
    const zoomInBtn = document.getElementById("zoom-in") as HTMLButtonElement;
    const zoomOutBtn = document.getElementById("zoom-out") as HTMLButtonElement;
    const zoomResetBtn = document.getElementById(
      "zoom-reset"
    ) as HTMLButtonElement;
    const layoutBtn = document.getElementById("layout1") as HTMLButtonElement;
    const layoutBtn4 = document.getElementById("layout4");
    const layoutBtn2 = document.getElementById("layout2") as HTMLButtonElement;
    const layoutBtn5 = document.getElementById("layout5") as HTMLButtonElement;

    const commonCheck = document.getElementById("common") as HTMLInputElement;
    const uncommonCheck = document.getElementById(
      "uncommon"
    ) as HTMLInputElement;
    const normalCheck = document.getElementById("normal") as HTMLInputElement;

    console.time("GraphCreation");
    // Parse GEXF string:
    var graph = parse(Graph, gexf);
    graph.forEachNode((node, attributes) => {
      attributes.size = 2;
      if (attributes.nodedef == "recipe type") {
        attributes.size = 6;
      }
      if (attributes.nodedef == "recipe") {
        attributes.size = 4;
      }
      if (attributes.nodedef == "cuisine") {
        attributes.size = 8;
      }
    });

    function checkIfBothChecked() {
      var checkbox1 = commonCheck.checked;
      var checkbox2 = uncommonCheck.checked;
      var checkbox3 = normalCheck.checked;

      if (checkbox1 && checkbox2) {
        console.log("Both checkboxes are checked!");
        renderer.setSetting("nodeReducer", (node, data) => {
          const res: Partial<NodeDisplayData> = { ...data };
          if (res.value == "uncommon" || res.value == "common") {
            var node = res.label;
            graph.forEachNeighbor(node, (neighbor) => {
              if (
                graph.getNodeAttribute(neighbor, "size") != 5 &&
                graph.getNodeAttribute(neighbor, "nodedef") != "ingredient"
              ) {
                graph.setNodeAttribute(neighbor, "size", 5);
              }
            });
            res.color = "#FF0000";
            res.size = 5;
          }
          if (res.size != 5 || res.nodedef == "recipe type") {
            res.hidden = true;
          }
          hiddenes(node, res);
          return res;
        });
      } else if (checkbox1 && checkbox3) {
        renderer.setSetting("nodeReducer", (node, data) => {
          const res: Partial<NodeDisplayData> = { ...data };
          if (res.value == "normal" || res.value == "common") {
            var node = res.label;
            graph.forEachNeighbor(node, (neighbor) => {
              if (
                graph.getNodeAttribute(neighbor, "size") != 5 &&
                graph.getNodeAttribute(neighbor, "nodedef") != "ingredient"
              ) {
                graph.setNodeAttribute(neighbor, "size", 5);
              }
            });
            res.color = "#FF0000";
            res.size = 5;
          }
          if (res.size != 5 || res.nodedef == "recipe type") {
            res.hidden = true;
          }
          hiddenes(node, res);
          return res;
        });
      } else if (checkbox2 && checkbox3) {
        renderer.setSetting("nodeReducer", (node, data) => {
          const res: Partial<NodeDisplayData> = { ...data };
          if (res.value == "uncommon" || res.value == "normal") {
            var node = res.label;
            graph.forEachNeighbor(node, (neighbor) => {
              if (
                graph.getNodeAttribute(neighbor, "size") != 5 &&
                graph.getNodeAttribute(neighbor, "nodedef") != "ingredient"
              ) {
                graph.setNodeAttribute(neighbor, "size", 5);
              }
            });
            res.color = "#FF0000";
            res.size = 5;
          }
          if (res.size != 5 || res.nodedef == "recipe type") {
            res.hidden = true;
          }
          hiddenes(node, res);
          return res;
        });
      }
    }
    function hiddenes(node, res) {
      if (
        state.hoveredNeighbors &&
        !state.hoveredNeighbors.has(node) &&
        state.hoveredNode !== node
      ) {
        res.label = "";
        res.color = "#f6f6f6";
      }

      if (state.selectedNode === node) {
        res.highlighted = true;
      } else if (state.suggestions && !state.suggestions.has(node)) {
        res.label = "";
        res.color = "#f6f6f6";
      }
    }
    // Function to handle checkbox change
    function commonCheck1() {
      renderer.setSetting("nodeReducer", (node, data) => {
        const res: Partial<NodeDisplayData> = { ...data };
        if (res.value == "common") {
          // console.log(res.color);
          var node = res.label;
          graph.forEachNeighbor(node, (neighbor) => {
            // console.log("test" + node + "  =>" + neighbor);

            graph.setNodeAttribute(neighbor, "size", 5);
          });
          res.color = "#FF0000";
          res.size = 5;
        }

        if (res.size != 5 || res.nodedef == "recipe type") {
          res.hidden = true;
        }
        hiddenes(node, res);
        return res;
      });
    }
    function uncommonCheck1() {
      renderer.setSetting("nodeReducer", (node, data) => {
        const res: Partial<NodeDisplayData> = { ...data };
        if (res.value == "uncommon") {
          var node = res.label;
          graph.forEachNeighbor(node, (neighbor) => {
            if (
              graph.getNodeAttribute(neighbor, "size") != 5 &&
              graph.getNodeAttribute(neighbor, "nodedef") != "ingredient"
            ) {
              graph.setNodeAttribute(neighbor, "size", 5);
            }
          });
          res.color = "#FF0000";
          res.size = 5;
        }
        if (res.size != 5 || res.nodedef == "recipe type") {
          res.hidden = true;
        }
        hiddenes(node, res);
        return res;
      });
    }
    function normalCheck1() {
      renderer.setSetting("nodeReducer", (node, data) => {
        const res: Partial<NodeDisplayData> = { ...data };
        if (res.value == "normal") {
          var node = res.label;
          graph.forEachNeighbor(node, (neighbor) => {
            if (
              graph.getNodeAttribute(neighbor, "size") != 5 &&
              graph.getNodeAttribute(neighbor, "nodedef") != "ingredient"
            ) {
              graph.setNodeAttribute(neighbor, "size", 5);
            }
          });
          res.color = "#FF0000";
          res.size = 5;
        }
        if (
          res.size != 5 ||
          res.nodedef == "recipe type" ||
          res.nodedef == "cuisine"
        ) {
          res.hidden = true;
        }
        hiddenes(node, res);
        return res;
      });
    }
    function handleCheckboxChange() {
      var checkbox1 = commonCheck.checked;
      var checkbox2 = uncommonCheck.checked;
      var checkbox3 = normalCheck.checked;

      if (checkbox1) {
        commonCheck1();
      } else if (checkbox2) {
        uncommonCheck1();
      } else if (checkbox3) {
        normalCheck1();
      } else if (!checkbox1 && !checkbox2 && !checkbox3) {
        resetGraph();
      }
      checkIfBothChecked();
    }

    // Add event listeners to the checkboxes
    commonCheck.addEventListener("change", handleCheckboxChange);
    uncommonCheck.addEventListener("change", handleCheckboxChange);
    normalCheck.addEventListener("change", handleCheckboxChange);

    //Chnage graph node size

    // Measure memory usage
    const memoryUsage = performance.memory;
    var renderer = new Sigma(graph, container, {
      minCameraRatio: 0.1,
      maxCameraRatio: 100,
    });
    var camera = renderer.getCamera();

    // Log the results
    // console.log("Graph creation time:", performance.now(), "s");
    console.log("Memory usage:", memoryUsage);
    console.timeEnd("GraphCreation");
    function click_node() {
      renderer.on("clickNode", (event) => {
        const node = event.node;
        if (graph.getNodeAttribute(node, "nodedef") == "recipe type") {
          alert("Please select a recipe");
        } else if (graph.getNodeAttribute(node, "nodedef") == "ingredient") {
          alert("Please select a recipe");
        } else if (graph.getNodeAttribute(node, "nodedef") == "cuisine") {
          var list = [];
          list.push(node);
          const neighbors = graph.neighbors(node);
          neighbors.forEach((neighborId) => {
            list.push(neighborId);
            const neighborNeighbors = graph.neighbors(neighborId);
            neighborNeighbors.forEach((neighborNeighborId) => {
              if (neighbors.includes(neighborNeighborId)) {
                list.push(neighborNeighborId);
                console.log(neighborId, neighborNeighborId);
              }
            });
          });
          renderer.setSetting("nodeReducer", (node, data) => {
            const res: Partial<NodeDisplayData> = { ...data };
            if (list.includes(res.label)) {
              if (res.nodedef != "cuisine") {
                res.color = "#FF0000";
                res.size = 5;
              } else {
                res.size = 5;
              }
            }
            if (res.size != 5 || res.nodedef == "recipe type") {
              res.hidden = true;
            }
            hiddenes(node, res);
            return res;
          });
        } else {
          const res = graph.neighbors(node);
          var sim_value = 0;
          var recipeList = [];
          for (let i = 0; i < res.length; i++) {
            if (graph.getNodeAttribute(res[i], "nodedef") == "recipe") {
              sim_value = graph.getEdgeAttribute(node, res[i], "value");
              var recipeObj = {
                name: res[i],
                score: sim_value,
              };
              recipeList.push(recipeObj);
            }
          }
          recipeList.sort(function (a, b) {
            return b.score - a.score; // Sort in descending order
          });

          var top5Recipes = recipeList.slice(0, 5);
          console.log(top5Recipes);
          var top5RecipesString = JSON.stringify(top5Recipes);
          var output = "Most similar recipes to " + node + ":\n\n";
          var i = 1;

          top5Recipes.forEach(function (recipe) {
            let score = parseFloat(recipe.score);
            output += i + ". " + recipe.name + " -> " + score.toFixed(2) + "\n";
            i += 1;
          });

          // Display the formatted output in an alert
          alert(output);
        }
        // console.log(node);
      });
    }
    click_node();
    // Retrieve some useful DOM elements:

    // Instanciate sigma:

    searchSuggestions.innerHTML = graph
      .nodes()
      .filter(
        (node) => graph.getNodeAttribute(node, "nodedef") === "ingredient"
      )
      .map(
        (node) =>
          `<option value="${graph.getNodeAttribute(node, "label")}"></option>`
      )
      .join("\n");

    const state: State = { searchQuery: "" };

    //Search node
    function setSearchQuery(query: string) {
      state.searchQuery = query;

      if (searchInput.value !== query) {
        searchInput.value = query;
      }

      if (query) {
        const lcQuery = query.toLowerCase();
        const suggestions = graph
          .nodes()
          .map((n) => ({
            id: n,
            label: graph.getNodeAttribute(n, "label") as string,
            type: graph.getNodeAttribute(n, "nodedef") as string,
          }))
          .filter(
            ({ type, label }) =>
              type === "ingredient" && label.toLowerCase().includes(lcQuery)
          );

        state.selectedNode = suggestions[0].id;
        state.suggestions = undefined;

        // Move the camera to center it on the selected node:
        const nodePosition = renderer.getNodeDisplayData(
          state.selectedNode
        ) as Coordinates;
        renderer.getCamera().animate(nodePosition, {
          duration: 100,
        });
        setHoveredNode(state.selectedNode);
        state.selectedNode = undefined;
      }
      // If the query is empty, then we reset the selectedNode / suggestions state:
      else {
        state.selectedNode = undefined;
        state.suggestions = undefined;
      }

      // Refresh rendering:
      renderer.refresh();
    }
    function updateSearchSuggestions(query) {
      const searchTerms = query.toLowerCase().split(",");
      const suggestions = [];
      for (const searchTerm of searchTerms) {
        // Trim the whitespace from the search term
        const lcQuery = searchTerm.trim();
        const matchingNodes = graph
          .nodes()
          .map((n) => ({
            id: n,
            label: graph.getNodeAttribute(n, "label") as string,
            type: graph.getNodeAttribute(n, "nodedef") as string,
          }))
          .filter(
            ({ type, label }) =>
              type === "ingredient" && label.toLowerCase() === lcQuery
          );

        // If there are matching suggestions, add them to the suggestions array
        if (matchingNodes.length > 0) {
          suggestions.push(matchingNodes[0]);
        }
      }
      console.log(suggestions);
      if (suggestions.length == 1) {
        state.selectedNode = suggestions[0].id;
        state.suggestions = undefined;
        const nodePosition = renderer.getNodeDisplayData(
          state.selectedNode
        ) as Coordinates;
        renderer.getCamera().animate(nodePosition, {
          duration: 100,
        });
        setHoveredNode(state.selectedNode);
        state.selectedNode = undefined;
      } else if (suggestions.length > 1) {
        const check = [];
        const list = [];

        for (let i = 0; i < suggestions.length; i++) {
          list.push(suggestions[i].label);
          const neighbors = graph.neighbors(suggestions[i].label);
          neighbors.forEach((neighborId) => {
            if (check.includes(neighborId)) {
              list.push(neighborId);
            } else {
              check.push(neighborId);
            }
          });
        }

        renderer.setSetting("nodeReducer", (node, data) => {
          const res: Partial<NodeDisplayData> = { ...data };
          if (list.includes(res.label)) {
            if (res.nodedef == "recipe") {
              res.size = 5;
            } else {
              res.size = 5;
            }
          }

          if (res.size != 5 || res.nodedef == "recipe type") {
            res.hidden = true;
          }
          hiddenes(node, res);
          return res;
        });
      } else {
        alert("No suggestions found");
        state.selectedNode = undefined;
        state.suggestions = undefined;
      }

      // Move the camera to center it on the selected node:
    }
    findButton.addEventListener("click", function () {
      const query = searchInput2.value.trim();
      updateSearchSuggestions(query);
    });
    function setHoveredNode(node?: string) {
      if (node) {
        // console.log(node);
        state.hoveredNode = node;
        state.hoveredNeighbors = new Set(graph.neighbors(node));
      } else {
        state.hoveredNode = undefined;
        state.hoveredNeighbors = undefined;
      }

      // Refresh rendering:
      renderer.refresh();
    }

    renderer.setSetting("nodeReducer", (node, data) => {
      const res: Partial<NodeDisplayData> = { ...data };
      hiddenes(node, res);
      return res;
    });

    renderer.setSetting("edgeReducer", (edge, data) => {
      const res: Partial<EdgeDisplayData> = { ...data };
      if (state.hoveredNode && !graph.hasExtremity(edge, state.hoveredNode)) {
        res.hidden = true;
      }
      if (
        state.suggestions &&
        (!state.suggestions.has(graph.source(edge)) ||
          !state.suggestions.has(graph.target(edge)))
      ) {
        res.hidden = true;
      }

      return res;
    });

    // Bind search input interactions:
    searchInput.addEventListener("input", () => {
      setSearchQuery(searchInput.value || "");
    });
    searchInput.addEventListener("blur", () => {
      setSearchQuery("");
    });

    // Bind graph interactions:
    renderer.on("enterNode", ({ node }) => {
      setHoveredNode(node);
    });
    renderer.on("leaveNode", () => {
      setHoveredNode(undefined);
    });
    layoutBtn.addEventListener("click", () => {
      resetGraph();
    });
    layoutBtn2.addEventListener("click", () => {
      filter_ingredient(graph);
    });

    // Bind zoom manipulation buttons
    zoomInBtn.addEventListener("click", () => {
      camera.animatedZoom({ duration: 600 });
    });
    zoomOutBtn.addEventListener("click", () => {
      camera.animatedUnzoom({ duration: 600 });
    });
    zoomResetBtn.addEventListener("click", () => {
      camera.animatedReset({ duration: 600 });
    });

    //filter ingredient with hover
    function filter_ingredient(graph) {
      renderer.setSetting("nodeReducer", (node, data) => {
        const res: Partial<NodeDisplayData> = { ...data };
        if (res.nodedef == "ingredient") {
          res.color = "#f6f6f6";
        }

        if (state.hoveredNeighbors) {
          if (res.nodedef == "ingredient") {
            res.color = "#FF0000";
            // console.log(res);
          }
        }
        if (
          state.hoveredNeighbors &&
          !state.hoveredNeighbors.has(node) &&
          state.hoveredNode !== node
        ) {
          res.label = "";
          res.color = "#f6f6f6";
        }

        if (state.selectedNode === node) {
          res.highlighted = true;
        } else if (state.suggestions && !state.suggestions.has(node)) {
          res.label = "";
          res.color = "#f6f6f6";
        }

        return res;
      });

      renderer.setSetting("edgeReducer", (edge, data) => {
        const res: Partial<EdgeDisplayData> = { ...data };
        if (res.Label == "ingredient") {
          res.hidden = true;
        }

        if (state.hoveredNode && !graph.hasExtremity(edge, state.hoveredNode)) {
          res.hidden = true;
        } else if (
          res.Label == "ingredient" &&
          graph.hasExtremity(edge, state.hoveredNode)
        ) {
          res.hidden = false;
        }

        if (
          state.suggestions &&
          (!state.suggestions.has(graph.source(edge)) ||
            !state.suggestions.has(graph.target(edge)))
        ) {
          res.hidden = true;
        }
        return res;
      });
    }

    //K-core (Done)
    layoutBtn5.addEventListener("click", () => {
      const k = layoutBtn4.value;
      var i = 0;
      var flag = false;
      for (i = 0; i <= k; i++) {
        while (true) {
          var c = 0;
          graph.forEachNode((node, attributes) => {
            const degree = graph.degree(node);
            if (degree < i) {
              graph.dropNode(node);
              c += 1;
            }
          });
          if (c == 0) break;
        }
      }
    });

    //reset graph (Done)
    function resetGraph() {
      // Clear existing graph data
      if (renderer) {
        renderer.kill();
      }

      graph = parse(Graph, gexf);
      graph.forEachNode((node, attributes) => {
        attributes.size = 2;
        if (attributes.nodedef == "recipe type") {
          attributes.size = 6;
        }
        if (attributes.nodedef == "recipe") {
          attributes.size = 4;
        }
        if (attributes.nodedef == "cuisine") {
          attributes.size = 8;
        }
      });
      renderer = new Sigma(graph, container, {
        minCameraRatio: 0.1,
        maxCameraRatio: 10,
      });
      // Get the new camera instance
      camera = renderer.getCamera();
      // Reapply event listeners
      renderer.on("enterNode", ({ node }) => {
        setHoveredNode(node);
      });
      renderer.on("leaveNode", () => {
        setHoveredNode(undefined);
      });
      renderer.setSetting("nodeReducer", (node, data) => {
        const res: Partial<NodeDisplayData> = { ...data };
        if (
          state.hoveredNeighbors &&
          !state.hoveredNeighbors.has(node) &&
          state.hoveredNode !== node
        ) {
          res.label = "";
          res.color = "#f6f6f6";
        }
        if (state.selectedNode === node) {
          res.highlighted = true;
        } else if (state.suggestions && !state.suggestions.has(node)) {
          res.label = "";
          res.color = "#f6f6f6";
        }
        return res;
      });

      renderer.setSetting("edgeReducer", (edge, data) => {
        const res: Partial<EdgeDisplayData> = { ...data };
        if (state.hoveredNode && !graph.hasExtremity(edge, state.hoveredNode)) {
          res.hidden = true;
        }
        if (
          state.suggestions &&
          (!state.suggestions.has(graph.source(edge)) ||
            !state.suggestions.has(graph.target(edge)))
        ) {
          res.hidden = true;
        }

        return res;
      });
      click_node();
      commonCheck.addEventListener("change", handleCheckboxChange);
      uncommonCheck.addEventListener("change", handleCheckboxChange);
      normalCheck.addEventListener("change", handleCheckboxChange);

      // Refresh the rendering
      renderer.refresh();
    }
    // Set proper range initial value:
  });
