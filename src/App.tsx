import React from "react";
import { Routes, Route } from "react-router-dom";
import AuthForm from "./components/authentication";
import Home from "./components/home";
import Room from "./components/room";
import { AppRoutes } from "./constants";

const App = () => {
  return (
    <div className="app">
      <Routes>
        <Route path={AppRoutes.home} element={<Home />} />
        <Route path={AppRoutes.room()} element={<Room />} />
        <Route path={AppRoutes.signIn} element={<AuthForm />} />
        <Route path={AppRoutes.signUp} element={<AuthForm signup />} />
      </Routes>
    </div>
  );
};

export default App;
