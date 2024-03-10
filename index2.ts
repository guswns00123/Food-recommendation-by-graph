import Sigma from "sigma";
import Graph from "graphology";
import { parse } from "graphology-gexf/browser";
import { Coordinates, EdgeDisplayData, NodeDisplayData } from "sigma/types";

const container = document.getElementById("sigma-container") as HTMLElement;
const searchInput = document.getElementById("search-input") as HTMLInputElement;
const searchSuggestions = document.getElementById(
  "suggestions"
) as HTMLDataListElement;

// Load external GEXF file:
fetch("./arctic.gexf")
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
    const Btn1 = document.getElementById("btn1") as HTMLButtonElement;
    const Btn2 = document.getElementById("btn2") as HTMLButtonElement;
    const Btn3 = document.getElementById("btn3") as HTMLButtonElement;

    console.time("GraphCreation");
    // Parse GEXF string:
    var graph = parse(Graph, gexf);

    //Chnage graph node size
    graph.forEachNode((node, attributes) => {
      attributes.size = 2;
    });
    // Measure memory usage
    const memoryUsage = performance.memory;
    var renderer = new Sigma(graph, container, {
      minCameraRatio: 0.1,
      maxCameraRatio: 100,
      enableEdgeEvents: true,
      edgeHoverSizeRatio: 2,
      edgeHoverExtremities: true,
      edgeHoverColor: "red",
      enableEdgeHovers: true,
    });
    var camera = renderer.getCamera();

    // Log the results
    // console.log("Graph creation time:", performance.now(), "s");
    console.log("Memory usage:", memoryUsage);
    console.timeEnd("GraphCreation");

    // Optionally, you can also bind a click event to handle interactions
    renderer.on("clickEdge", (event) => {
      const edge = event.edge;
      const res = graph.getEdgeAttributes(edge);
      const source = graph.source(edge);
      const target = graph.target(edge);
      alert(`${source} and ${target} are used together in  ${res.value}`);
    });
    renderer.on("clickNode", (event) => {
      const node = event.node;
      const res = graph.getNodeAttributes(node);
      alert(`Node ${node} has type : ${res.att}`);
    });
    renderer.on("enterEdge", (event) => {
      setHoveredEdge(event);
    });
    function setHoveredEdge(event) {
      const edge = event.edge;
      const res = graph.getEdgeAttributes(edge);
      if (edge) {
        state.hoveredEdge = edge;
      } else {
        state.hoveredNode = undefined;
        state.hoveredNeighbors = undefined;
      }

      // Refresh rendering:
      renderer.refresh();
    }

    searchSuggestions.innerHTML = graph
      .nodes()
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
          }))
          .filter(({ label }) => label.toLowerCase().includes(lcQuery));

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
        res.color = "#f6f6";
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

    Btn1.addEventListener("click", () => {
      renderer.setSetting("nodeReducer", (node, data) => {
        const res: Partial<NodeDisplayData> = { ...data };
        if (res.value == "common") {
          // console.log(res.color);
          res.color = "#FF0000";
          res.size = 5;
        } else if (res.value == "uncommon") {
          res.color = "#9A96E5";
          res.size = 2;
        } else if (res.value == "normal") {
          res.color = "#9A96E5";
          res.size = 2;
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
    });
    // basic = #9A96E5
    Btn2.addEventListener("click", () => {
      renderer.setSetting("nodeReducer", (node, data) => {
        const res: Partial<NodeDisplayData> = { ...data };
        if (res.value == "uncommon") {
          res.color = "#FF0000";
          res.size = 5;
        } else if (res.value == "common") {
          res.color = "#9A96E5";
          res.size = 2;
        } else if (res.value == "normal") {
          res.color = "#9A96E5";
          res.size = 2;
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
    });
    Btn3.addEventListener("click", () => {
      renderer.setSetting("nodeReducer", (node, data) => {
        const res: Partial<NodeDisplayData> = { ...data };
        if (res.value == "normal") {
          res.color = "#FF0000";
          res.size = 5;
        } else if (res.value == "common") {
          res.color = "#9A96E5";
          res.size = 2;
        } else if (res.value == "uncommon") {
          res.color = "#9A96E5";
          res.size = 2;
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

      // Refresh the rendering
      renderer.refresh();
    }
    // Set proper range initial value:
  });
