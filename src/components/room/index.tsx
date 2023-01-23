import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import socket from "../../config/socket";
import MyVideo from "../myVideo";
import CustomVideo from "../customVideo";
import { Instance, SimplePeer as SimplePeerType } from "simple-peer";
import { useContext } from "react";
import UserContext from "../../context/userContext";
import { AppRoutes, PeerTimeout, Strings } from "../../constants";
import { joinRoom_api } from "../../api";
import { ReceiverSignalParamsType } from "../../types/socket";
import { getMediaStreamFromRef, getUserMediaStream } from "../../utils/navigator";

// We are using a CDN to work with SimplePeer because there is an issue
// with the library "simple-peer"
declare global {
  interface Window {
    SimplePeer: SimplePeerType;
  }
}

const Room = () => {
  const [userAllowedToJoin, setUserAllowedToJoin] = useState(false);
  const { roomId } = useParams();
  const { user, isLoading } = useContext(UserContext);
  const navigate = useNavigate();
  const initiatorPeer = useRef<Instance | undefined>(undefined);
  const receiverPeer = useRef<Instance | undefined>(undefined);
  const myVideoStream = useRef<HTMLVideoElement>(null);
  const otherVideoStream = useRef<HTMLVideoElement>(null);

  const callUser = React.useCallback(() => {
    if (!user || !roomId || !userAllowedToJoin) return;
    const peer = new window.SimplePeer({
      initiator: true,
      trickle: false,
      iceCompleteTimeout: PeerTimeout,
      stream: getMediaStreamFromRef(myVideoStream)
    });

    peer.on("signal", data => {
      socket.emit("sendSignal", { signal: data, email: user.email, roomId });
    });

    // Last step for two-way handshake where the user
    // acknowledges the connection and transfers continues
    // on between peers afterwards
    socket.on("acknowledgeSignal", params => {
      peer.signal(params.signal);
    });

    peer.on("stream", remoteStream => {
      if (otherVideoStream.current) {
        otherVideoStream.current.srcObject = remoteStream;
      } else {
        const video = document.createElement("video");
        const container = document.getElementById("vid-container");
        container?.appendChild(video);
        video.srcObject = remoteStream;
        video.play();
      }
    });
    return peer;
  }, [user, roomId, userAllowedToJoin]);

  const acceptCall = React.useCallback(
    (params: ReceiverSignalParamsType) => {
      if (!user || !roomId || !userAllowedToJoin) return;
      const peer = new window.SimplePeer({
        initiator: false,
        trickle: false,
        iceCompleteTimeout: PeerTimeout,
        stream: getMediaStreamFromRef(myVideoStream)
      });

      peer.on("signal", data => {
        // This is for two-way handshake, we now send our signal
        // and let the process begin.
        socket.emit("sendPiggyBackSignal", { signal: data, email: user.email, roomId });
      });

      peer.signal(params.signal);

      peer.on("stream", remoteStream => {
        if (otherVideoStream.current) {
          otherVideoStream.current.srcObject = remoteStream;
        } else {
          const video = document.createElement("video");
          const container = document.getElementById("vid-container");
          container?.appendChild(video);
          video.srcObject = remoteStream;
          video.play();
        }
      });

      return peer;
    },
    [user, roomId, userAllowedToJoin]
  );

  /**
   * @returns unsubscribe function that can be called to
   * unsubbscribe from the events that this function listened to
   */
  const handleSocketListenersForJoinedRoom = React.useCallback(() => {
    if (!roomId || !user || !userAllowedToJoin) return;

    // User has joined the room
    // First up, inform everyone that he has joined room
    socket.emit("joinRoom", { email: user.email, roomId });

    // Set up a listener for to listen when someone
    // else joins the room
    socket.on("userJoined", params => {
      console.log(`${params.email} connected...`);
    });

    if (!initiatorPeer.current) {
      // call and let the other user now that you have joined the room
      initiatorPeer.current = callUser();
    }

    socket.on("receiveSignal", params => {
      // listener for receiving calls
      if (!receiverPeer.current) {
        receiverPeer.current = acceptCall(params);
      }
    });

    // Unsubscribe from socket listeners
    return () => {
      socket.off("userJoined");
      socket.off("receiveSignal");
      socket.off("acknowledgeSignal");
    };
  }, [roomId, user, callUser, acceptCall, userAllowedToJoin]);

  const changeVideoStream = React.useCallback((stream: MediaStream | null) => {
    if (myVideoStream.current) {
      myVideoStream.current.srcObject = stream;
    }
  }, []);

  /**
   * Validation of incoming user.
   * Check whether the user is allowed to join room or not.
   * If user is not allowed to join, redirect him...
   */
  useEffect(() => {
    // Join room validation
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
        } else {
          setUserAllowedToJoin(true);
        }
      } catch (err) {
        console.error(err);
        navigate(AppRoutes.home);
      }
    };
    joinRoomValidation();
  }, [isLoading, roomId, user]);

  /**
   * This is the main useEffect that takes care of getting media stream
   * and setting up sockets
   */
  useEffect(() => {
    async function init() {
      let myStream: MediaStream | undefined = undefined;
      try {
        myStream = await getUserMediaStream({ video: true, audio: true });
        changeVideoStream(myStream);
        return handleSocketListenersForJoinedRoom();
      } catch (err) {
        alert("Something is wrong with media stream");
        console.error(err);
      }
    }

    let unsubscribe: Promise<(() => void) | undefined> | undefined = undefined;
    if (userAllowedToJoin && user && roomId && !isLoading) unsubscribe = init();

    return () => {
      unsubscribe
        ?.then(removeSocketListeners => removeSocketListeners?.())
        .catch(err => console.error(err));
    };
  }, [
    userAllowedToJoin,
    user,
    roomId,
    isLoading,
    changeVideoStream,
    handleSocketListenersForJoinedRoom
  ]);

  /**
   * This useEffect destroys the peer whenever user moves out of the page or
   * the component unmounts due to any reason.
   * TODO: Add socket disconnect logic as well
   */
  useEffect(() => {
    return () => {
      initiatorPeer.current?.destroy();
      receiverPeer.current?.destroy();
    };
  }, []);

  return (
    <div id="vid-container" className="flex gap-standard">
      <MyVideo myMediaStream={myVideoStream} changeMediaStream={changeVideoStream} />
      <CustomVideo ref={otherVideoStream} isMuted={false} isCameraOff={false} isSelfVideo={false} />
    </div>
  );
};

export default Room;
