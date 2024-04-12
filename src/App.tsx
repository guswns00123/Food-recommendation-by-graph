import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NodeDetail from "./NodeDetail";

const HomePage = () => <div>Welcome to the homepage!</div>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/nodes/:nodeId" element={<NodeDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
