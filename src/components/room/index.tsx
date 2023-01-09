import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import socket from "../../config/socket";
import CustomSocketEvents from "../../constants/socket";
import MyVideo from "../myVideo";

const Room = () => {
  const { roomId } = useParams();

  useEffect(() => {
    socket.emit(CustomSocketEvents.JOIN_ROOM, { roomId });
  }, [roomId]);

  return (
    <>
      <MyVideo />
    </>
  );
};

export default Room;
