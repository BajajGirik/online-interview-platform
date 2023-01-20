import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import socket from "../../config/socket";
import MyVideo from "../myVideo";
import CustomVideo from "../customVideo";
import Peer from "simple-peer";
import { useContext } from "react";
import UserContext from "../../context/userContext";
import { AppRoutes, Strings } from "../../constants";
import { joinRoom_api } from "../../api";
import { getMediaStreamFromRef } from "../../utils/navigator";

const Room = () => {
  const { roomId } = useParams();
  const { user, isLoading } = useContext(UserContext);
  const navigate = useNavigate();
  const myVideoStream = useRef<HTMLVideoElement>(null);
  const otherVideoStream = useRef<HTMLVideoElement>(null);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    // join room validation
    const joinRoomValidation = async () => {
      if (isLoading) return;

      if (!user) {
        alert(Strings.homePage.errors.loginToPerformAction);
        return navigate(AppRoutes.signIn);
      }
      if (!roomId) {
        alert(Strings.homePage.errors.roomIdEmpty);
        return navigate(AppRoutes.home);
      }

      try {
        const allowed = await joinRoom_api({ email: user.email, roomId: roomId });
        if (!allowed) {
          alert(Strings.homePage.errors.notAllowedToJoinRoom);
          navigate(AppRoutes.home);
          setValidated(false);
        } else {
          setValidated(true);
        }
      } catch (err) {
        console.error(err);
        navigate(AppRoutes.home);
      }
    };
    joinRoomValidation();
  }, [isLoading, roomId, user]);

  /**
   * @returns unsubscribe function that can be called to
   * unsubbscribe from the events that this function listened to
   */
  const handleSocketListenersForJoinedRoom = () => {
    if (!roomId || !user) return;

    // Set up a listener for to listen when someone
    // else joins the room
    socket.on("userJoined", params => {
      console.log(`${params.email} connected...`);
    });

    // Since we just joined up, let us setup peer and
    // send signal to others by firing off "sendSignal"
    // when the peer signal will be available :)
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: getMediaStreamFromRef(myVideoStream)
    });

    peer.on("signal", data => {
      console.log("SendSignal");
      socket.emit("sendSignal", { signal: data, email: user.email, roomId });
    });

    // We signaled our joining and shared it for peer
    // connection. Now let's also add some listeners to
    // listen to someone else signaling when they join
    socket.on("receiveSignal", params => {
      console.log("ReceiveSignal");
      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream: getMediaStreamFromRef(myVideoStream)
      });

      peer.on("signal", data => {
        // This is for two-way handshake, we now send our signal
        // and let the process begin.
        socket.emit("sendPiggyBackSignal", { signal: data, email: user.email, roomId });
      });

      peer.on("stream", stream => {
        console.log("Receiving Stream in receiveSignal");
        if (otherVideoStream.current) {
          otherVideoStream.current.srcObject = stream;
        }
      });

      peer.signal(params.signal);
    });

    // Last step for two-way handshake where the user
    // acknowledges the connection and transfers continues
    // on between peers afterwards
    socket.on("acknowledgeSignal", params => {
      console.log("Ack");
      peer.signal(params.signal);
    });

    peer.on("stream", stream => {
      console.log("Receiving Stream");
      if (otherVideoStream.current) {
        otherVideoStream.current.srcObject = stream;
      }
    });

    // User has joined the room
    // First up, inform everyone that he has joined room
    socket.emit("joinRoom", { email: user.email, roomId });

    // Unsubscribe from socket listeners
    return () => {
      socket.off("userJoined");
      socket.off("receiveSignal");
      socket.off("receiveSignal");
      socket.off("acknowledgeSignal");
    };
  };

  useEffect(() => {
    if (validated) return handleSocketListenersForJoinedRoom();
  }, [validated]);

  return (
    <div className="flex gap-standard">
      <MyVideo myVideoStream={myVideoStream} />
      <CustomVideo ref={otherVideoStream} isMuted={false} isCameraOff={false} isSelfVideo={false} />
    </div>
  );
};

export default Room;
