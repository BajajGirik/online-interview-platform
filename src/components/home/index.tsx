import React from "react";
import { v4 as uuid } from "uuid";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <h1> Online interview platform </h1>
      <Link to={`/${uuid()}`}> Create a room </Link>
    </>
  );
};

export default Home;
