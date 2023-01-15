import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../../config/socket";
import MyVideo from "../myVideo";

const Room = () => {
  // TODO: Set hasJoinedRoom initially to false and make a
  // socket handler for this
  const [hasJoinedRoom, setHasJoinedRoom] = useState(false);
  const { roomId } = useParams();

  /**
   * @returns unsubscribe function that can be called to
   * unsubbscribe from the events that this function listened to
   */
  const handleSocketListenersForNonJoinedRoom = () => {
    if (!roomId) return;

    // listener functions
    const onJoinRequestAccept = () => {
      alert("bohot shukriya, badi meherbani...");
      // create peer mesh
      //...
      setHasJoinedRoom(true);
    };
    const onJoinRequestReject = () => {
      alert("tera nam dhokha rakh du, naraz hogi kya...");
    };

    // TODO: Add peer id
    socket.emit("requestJoin", roomId, socket.id);
    socket.on("joinRequestAccept", onJoinRequestAccept);
    socket.on("joinRequestReject", onJoinRequestReject);

    // Unsubsribe from socket events
    return () => {
      socket.off("joinRequestAccept");
      socket.off("joinRequestReject");
    };
  };

  /**
   * @returns unsubscribe function that can be called to
   * unsubbscribe from the events that this function listened to
   */
  const handleSocketListenersForJoinedRoom = () => {
    if (!roomId) return;

    // User has joined the room
    const newUserConnected = () => {
      console.log("new user yeyyyy!!");
    };

    socket.emit("joinRoom", { roomId });

    socket.on("userConnected", newUserConnected);

    // Unsubscribe from socket listeners
    return () => {
      socket.off("userConnected");
    };
  };

  useEffect(() => {
    if (!roomId) return;

    // User don't have the permission to joined room yet
    if (hasJoinedRoom) {
      return handleSocketListenersForJoinedRoom();
    }
    return handleSocketListenersForNonJoinedRoom();
  }, [roomId]);

  return (
    <>
      <MyVideo />
    </>
  );
};

export default Room;
