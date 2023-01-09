import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import socket from "../../config/socket";
import MyVideo from "../myVideo";

const Room = () => {
  const { roomId } = useParams();

  useEffect(() => {
    if (!roomId) return;
    socket.emit("joinRoom", { roomId });
  }, [roomId]);

  return (
    <>
      <MyVideo />
    </>
  );
};

export default Room;
