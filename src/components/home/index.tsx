import React, { useContext } from "react";
import { v4 as uuid } from "uuid";
import { Link } from "react-router-dom";
import { AppRoutes, Strings } from "../../constants";
import UserContext from "../../context/userContext";

const Home = () => {
  const { logout } = useContext(UserContext);
  return (
    <>
      <h1> {Strings.homePage.heading} </h1>
      <Link to={AppRoutes.room(uuid())}> {Strings.homePage.createRoom} </Link>
      <button onClick={logout}>{Strings.homePage.logoutButtonContent}</button>
    </>
  );
};

export default Home;
