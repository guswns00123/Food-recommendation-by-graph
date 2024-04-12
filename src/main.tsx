import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import RecipeDetail from './RecipeDetail'; // Ensure you have this component implemented
import './index.css';

import Sigma from "sigma";
import Graph from "graphology";
import { parse } from "graphology-gexf/browser";
import { Coordinates, EdgeDisplayData, NodeDisplayData } from "sigma/types";

const searchInput = document.getElementById("search-input") as HTMLInputElement;
const searchSuggestions = document.getElementById(
  "suggestions"
) as HTMLDataListElement;
const searchInput2 = document.getElementById("searchInput");
const findButton = document.getElementById("findButton");
// Load external GEXF file:
function setupSigma() {
  fetch("./final.gexf")
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
      const koreancheck = document.getElementById("korean") as HTMLInputElement;
      const chinesecheck = document.getElementById("chinese") as HTMLInputElement;
      const japanesecheck = document.getElementById(
        "japanese"
      ) as HTMLInputElement;
      const thaicheck = document.getElementById("thai") as HTMLInputElement;
      const indiancheck = document.getElementById("indian") as HTMLInputElement;
      const spanishcheck = document.getElementById("spanish") as HTMLInputElement;
      const italiancheck = document.getElementById("italian") as HTMLInputElement;
      const mexicancheck = document.getElementById("mexican") as HTMLInputElement;
      const americancheck = document.getElementById(
        "american"
      ) as HTMLInputElement;
      const frenchcheck = document.getElementById("french") as HTMLInputElement;
      console.time("GraphCreation");

      console.time("GraphCreation");
      // Parse GEXF string:
      var graph = parse(Graph, gexf);
      graph.forEachNode((node, attributes) => {
        attributes.size = 2;
        if (attributes.nodedef == "recipe type") {
          attributes.size = 6;
        }
        if (attributes.nodedef == "recipe") {
          attributes.size = 2;
        }
        if (attributes.nodedef == "cuisine") {
          attributes.size = 6;
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

      function handleCheckboxChange() {
        var checkbox1 = commonCheck.checked;
        var checkbox2 = uncommonCheck.checked;
        var checkbox3 = normalCheck.checked;

        if (checkbox1) {
          checking2("common");
        } else if (checkbox2) {
          checking2("uncommon");
        } else if (checkbox3) {
          checking2("normal");
        } else if (!checkbox1 && !checkbox2 && !checkbox3) {
          resetGraph();
        }
        checkIfBothChecked();
      }
      function checking2(type) {
        renderer.setSetting("nodeReducer", (node, data) => {
          const res: Partial<NodeDisplayData> = { ...data };
          if (res.value == type) {
            var node = res.label;
            graph.forEachNeighbor(node, (neighbor) => {
              if (
                graph.getNodeAttribute(neighbor, "size") != 3 &&
                graph.getNodeAttribute(neighbor, "nodedef") != "ingredient"
              ) {
                graph.setNodeAttribute(neighbor, "size", 3);
              }
            });

            res.size = 3;
          }
          if (
            res.size != 3 ||
            res.nodedef == "recipe type" ||
            res.nodedef == "cuisine"
          ) {
            res.hidden = true;
          }
          hiddenes(node, res);
          return res;
        });
      }
      function checking(cuisine) {
        renderer.setSetting("nodeReducer", (node, data) => {
          const res: Partial<NodeDisplayData> = { ...data };
          if (res.value2 == cuisine) {
            var node = res.label;
            graph.forEachNeighbor(node, (neighbor) => {
              if (graph.getNodeAttribute(neighbor, "nodedef") == "ingredient") {
                graph.setNodeAttribute(neighbor, "size", 3);
                // console.log(neighbor);
              }
            });

            res.size = 3;
          }
          if (res.size == 3) {
            res.hidden = false;
          } else {
            res.hidden = true;
          }
          hiddenes(node, res);
          return res;
        });
      }
      function cuisineCheckboxChange() {
        var c1 = koreancheck.checked;
        var c2 = chinesecheck.checked;
        var c3 = japanesecheck.checked;
        var c4 = thaicheck.checked;
        var c5 = indiancheck.checked;
        var c6 = spanishcheck.checked;
        var c7 = italiancheck.checked;
        var c8 = mexicancheck.checked;
        var c9 = americancheck.checked;
        var c10 = frenchcheck.checked;
        if (c1) {
          checking("korean");
        } else if (c2) {
          checking("chinese");
        } else if (c3) {
          checking("japanese");
        } else if (c4) {
          checking("thai");
        } else if (c5) {
          checking("indian");
        } else if (c6) {
          checking("spanish");
        } else if (c7) {
          checking("italian");
        } else if (c8) {
          checking("mexican");
        } else if (c9) {
          checking("american");
        } else if (c10) {
          checking("french");
        } else {
          resetGraph();
        }
        checkmultiChecked();
      }
      function checkmultiChecked() {
        var c1 = koreancheck.checked;
        var c2 = chinesecheck.checked;
        var c3 = japanesecheck.checked;
        var c4 = thaicheck.checked;
        var c5 = indiancheck.checked;
        var c6 = spanishcheck.checked;
        var c7 = italiancheck.checked;
        var c8 = mexicancheck.checked;
        var c9 = americancheck.checked;
        var c10 = frenchcheck.checked;
        var checkedCuisines = [];
        if (koreancheck.checked) {
          checkedCuisines.push("korean");
        }
        if (chinesecheck.checked) {
          checkedCuisines.push("chinese");
        }
        if (japanesecheck.checked) {
          checkedCuisines.push("japanese");
        }
        if (thaicheck.checked) {
          checkedCuisines.push("thai");
        }
        if (indiancheck.checked) {
          checkedCuisines.push("indian");
        }
        if (spanishcheck.checked) {
          checkedCuisines.push("spanish");
        }
        if (italiancheck.checked) {
          checkedCuisines.push("italian");
        }
        if (mexicancheck.checked) {
          checkedCuisines.push("mexican");
        }
        if (americancheck.checked) {
          checkedCuisines.push("american");
        }
        if (frenchcheck.checked) {
          checkedCuisines.push("french");
        }
        console.log(checkedCuisines);
        renderer.setSetting("nodeReducer", (node, data) => {
          const res: Partial<NodeDisplayData> = { ...data };
          if (checkedCuisines.includes(res.value2)) {
            var node = res.label;
            graph.forEachNeighbor(node, (neighbor) => {
              if (graph.getNodeAttribute(neighbor, "nodedef") == "ingredient") {
                graph.setNodeAttribute(neighbor, "size", 3);
                // console.log(neighbor);
              }
            });
  
            res.size = 3;
          }
          if (res.size == 3) {
            res.hidden = false;
          } else {
            res.hidden = true;
          }
          hiddenes(node, res);
          return res;
        });
      }
      // Add event listeners to the checkboxes
      commonCheck.addEventListener("change", handleCheckboxChange);
      uncommonCheck.addEventListener("change", handleCheckboxChange);
      normalCheck.addEventListener("change", handleCheckboxChange);
      koreancheck.addEventListener("change", cuisineCheckboxChange);
      chinesecheck.addEventListener("change", cuisineCheckboxChange);
      japanesecheck.addEventListener("change", cuisineCheckboxChange);
      thaicheck.addEventListener("change", cuisineCheckboxChange);
      indiancheck.addEventListener("change", cuisineCheckboxChange);
      spanishcheck.addEventListener("change", cuisineCheckboxChange);
      italiancheck.addEventListener("change", cuisineCheckboxChange);
      mexicancheck.addEventListener("change", cuisineCheckboxChange);
      americancheck.addEventListener("change", cuisineCheckboxChange);
      frenchcheck.addEventListener("change", cuisineCheckboxChange);

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

            const ras = graph.neighbors(node);
            console.log(graph.getNodeAttribute(node, "order"));
            const ingredient = [];
            for (let i = 0; i < ras.length; i++) {
              if (graph.getNodeAttribute(ras[i], "nodedef") == "ingredient") {
                ingredient.push(ras[i]);
              }
            }

            console.log(ingredient);
            var regex = /'([^']*)'/g;
            var matches;
            var ingredientsArray = [];

            while (
              (matches = regex.exec(graph.getNodeAttribute(node, "order"))) !==
              null
            ) {
              ingredientsArray.push(matches[1]); // match[1]은 ' '로 묶인 부분의 문자열
            }

            var c = 0;
            var together = [];
            var order = [];
            for (let i = 0; i < ingredientsArray.length; i++) {
              for (let j = 0; j < ingredient.length; j++) {
                if (ingredientsArray[i].includes(ingredient[j])) {
                  together.push(ingredient[j]);
                }
              }
              if (together.length > 0) {
                order.push(together);
                together = [];
              }
            }

            localStorage.setItem("nodeOutput", output);
            localStorage.setItem("order", order);
            localStorage.setItem("together", together);
            localStorage.setItem("ingredient", ingredient);
          }
        });

        renderer.on("clickNode", (event) => {
          const node = event.node;

          const url = `http://localhost:5173/nodes/${node}`;
          window.open(url, '_blank').focus();
        });
      }

      click_node();

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
          var check = [];

          const list = [];
          var c = 0;
          for (let i = 0; i < suggestions.length; i++) {
            list.push(suggestions[i].label);
            const neighbors = graph.neighbors(suggestions[i].label);
            neighbors.forEach((neighborId) => {
              for (let j = 0; j < suggestions.length; j++) {
                if (graph.hasEdge(neighborId, suggestions[j].label)) {
                  c += 1;
                }
              }
              if (c == suggestions.length) {
                list.push(neighborId);
              }
              c = 0;
            });
          }

          renderer.setSetting("nodeReducer", (node, data) => {
            const res: Partial<NodeDisplayData> = { ...data };
            if (list.includes(res.label)) {
              if (res.nodedef == "recipe") {
                var a = graph.getNodeAttribute(res.label, "hsr");
                res.size = a * 1.2;
              } else {
                res.hidden = true;
              }
            } else {
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
      }
      findButton.addEventListener("click", function () {
        const query = searchInput2.value.trim();
        updateSearchSuggestions(query);
        setupSecondGraph();
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

        renderer.refresh();
      }
    });


    
}

function setupSecondGraph() {
  // Example setup for the second graph
  fetch("./final.gexf")
    .then(res => res.text())
    .then(gexf => {
      const container = document.getElementById("second-sigma-container");
      if (!container) return;
      const graph = parse(Graph, gexf);
      const renderer = new Sigma(graph, container);

      // Customize your graph setup here
    });
}

document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }

  setupSigma(); // Existing graph setup
  // setupSecondGraph(); // New graph setup
});