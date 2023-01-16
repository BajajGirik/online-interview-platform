import React from "react";
import { v4 as uuid } from "uuid";
import { Link } from "react-router-dom";
import { AppRoutes } from "../../constants";

const Home = () => {
  return (
    <>
      <h1> Online interview platform </h1>
      <Link to={AppRoutes.room(uuid())}> Create a room </Link>
    </>
  );
};

export default Home;
