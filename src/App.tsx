import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Room from "./components/room";

const App = () => {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:room" element={<Room />} />
      </Routes>
    </div>
  );
};

export default App;
