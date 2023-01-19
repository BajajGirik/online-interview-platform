import React, { useContext, useState } from "react";
// import { v4 as uuid } from "uuid";
import { useNavigate } from "react-router-dom";
import { AppRoutes, Strings } from "../../constants";
import UserContext from "../../context/userContext";
import { createRoom_api, joinRoom_api } from "../../api";
import styles from "../../styles/home.module.css";

const Home = () => {
  const [roomIdToJoin, setRoomIdToJoin] = useState("");
  const [intervieweeEmail, setIntervieweeEmail] = useState("");
  const navigate = useNavigate();
  const { logout, user } = useContext(UserContext);

  const handleJoinRoom = async () => {
    if (!roomIdToJoin) {
      return alert(Strings.homePage.errors.roomIdEmpty);
    }

    if (!user) {
      return alert(Strings.homePage.errors.loginToPerformAction);
    }

    try {
      const allowed = await joinRoom_api({ email: user.email, roomId: roomIdToJoin });
      if (allowed) return navigate(AppRoutes.room(roomIdToJoin));
      alert(Strings.homePage.errors.notAllowedToJoinRoom);
    } catch (err) {
      console.error(err);
      alert(Strings.homePage.errors.joinRoomFailed);
    }
  };

  const handleCreateRoom = async () => {
    if (!intervieweeEmail) {
      return alert(Strings.homePage.errors.emailIdEmpty);
    }

    if (!user) {
      return alert(Strings.homePage.errors.loginToPerformAction);
    }

    try {
      const createdRoomId = await createRoom_api({ hostEmail: user.email, intervieweeEmail });
      navigate(AppRoutes.room(createdRoomId));
    } catch (err) {
      console.error(err);
      alert(Strings.homePage.errors.createRoomFailed);
    }
  };

  return (
    <div className={`flex-col ${styles.home__container}`}>
      <h1> {Strings.homePage.heading} </h1>

      <div className={`flex s${styles.home__roomContainer}`}>
        <div className={`${styles.home__createJoinRoomContainer} flex-col`}>
          <input
            type="email"
            value={intervieweeEmail}
            onChange={e => setIntervieweeEmail(e.target.value)}
            placeholder="interviewee's email"
          />
          <button onClick={handleCreateRoom}>{Strings.homePage.createRoom}</button>
        </div>
        <div className={`${styles.home__createJoinRoomContainer} flex-col`}>
          <input
            type="text"
            value={roomIdToJoin}
            onChange={e => setRoomIdToJoin(e.target.value)}
            placeholder="room id"
          />
          <button onClick={handleJoinRoom}>{Strings.homePage.joinRoom}</button>
        </div>
      </div>
      <button onClick={logout}>{Strings.homePage.logout}</button>
    </div>
  );
};

export default Home;
