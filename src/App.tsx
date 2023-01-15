import React from "react";
import { Routes, Route } from "react-router-dom";
import AuthForm from "./components/authentication";
import Home from "./components/home";
import Room from "./components/room";

const App = () => {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:roomId" element={<Room />} />
        <Route path="/signin" element={<AuthForm />} />
        <Route path="/signup" element={<AuthForm signup />} />
      </Routes>
    </div>
  );
};

export default App;
