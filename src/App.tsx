import React from "react";
import Notifications from "./components/notifications";
import Sidebar from "./components/sidebar";
import VideoPlayer from "./components/videoPlayer";
// import { Routes, Route } from "react-router-dom";
// import AuthForm from "./components/authentication";
// import Home from "./components/home";
// import Room from "./components/room";
// import { AppRoutes } from "./constants";

const App = () => {
  // return (
  //   <div className="app">
  //     <Routes>
  //       <Route path={AppRoutes.home} element={<Home />} />
  //       <Route path={AppRoutes.room()} element={<Room />} />
  //       <Route path={AppRoutes.signIn} element={<AuthForm />} />
  //       <Route path={AppRoutes.signUp} element={<AuthForm signup />} />
  //     </Routes>
  //   </div>
  // );
  return (
    <div>
      <VideoPlayer />
      <Sidebar>
        <Notifications />
      </Sidebar>
    </div>
  );
};

export default App;
