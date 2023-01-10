import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import socket from "../../config/socket";
import MyVideo from "../myVideo";

const Room = () => {
  const { roomId } = useParams();

  useEffect(() => {
    if (!roomId) return;

    const newUserConnected = () => {
      console.log("new user yeyyyy!!");
    };

    socket.emit("joinRoom", { roomId });

    socket.on("userConnected", newUserConnected);

    return () => {
      socket.off("userConnected", newUserConnected);
    };
  }, [roomId]);

  return (
    <>
      <MyVideo />
    </>
  );
};

export default Room;
