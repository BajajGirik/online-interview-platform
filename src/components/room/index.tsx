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

// We are using a CDN to work with SimplePeer because there is an issue
// with the library "simple-peer"
declare global {
  interface Window {
    SimplePeer: SimplePeerType;
  }
}

const Room = () => {
  const { roomId } = useParams();
  const { user, isLoading } = useContext(UserContext);
  const navigate = useNavigate();
  const [ownVideoStream, setOwnVideoStream] = useState<MediaStream | null>(null);
  const initiatorPeer = useRef<Instance | undefined>(undefined);
  const receiverPeer = useRef<Instance | undefined>(undefined);
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

  const callUser = React.useCallback(() => {
    if (!user || !roomId) return;
    const peer = new window.SimplePeer({
      initiator: true,
      trickle: false,
      iceCompleteTimeout: PeerTimeout
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

    peer.on("stream", stream => {
      if (otherVideoStream.current) {
        otherVideoStream.current.srcObject = stream;
      } else {
        const video = document.createElement("video");
        const container = document.getElementById("vid-container");
        container?.appendChild(video);
        video.srcObject = stream;
        video.play();
      }
    });
    return peer;
  }, [user, roomId]);

  const acceptCall = React.useCallback(
    (params: ReceiverSignalParamsType) => {
      if (!user || !roomId) return;
      const peer = new window.SimplePeer({
        initiator: false,
        trickle: false,
        iceCompleteTimeout: PeerTimeout
      });

      peer.on("signal", data => {
        // This is for two-way handshake, we now send our signal
        // and let the process begin.
        socket.emit("sendPiggyBackSignal", { signal: data, email: user.email, roomId });
      });

      peer.signal(params.signal);

      peer.on("stream", stream => {
        if (otherVideoStream.current) {
          otherVideoStream.current.srcObject = stream;
        } else {
          const video = document.createElement("video");
          const container = document.getElementById("vid-container");
          container?.appendChild(video);
          video.srcObject = stream;
          video.play();
        }
      });

      return peer;
    },
    [user, roomId]
  );

  /**
   * @returns unsubscribe function that can be called to
   * unsubbscribe from the events that this function listened to
   */
  const handleSocketListenersForJoinedRoom = React.useCallback(() => {
    if (!roomId || !user) return;

    // User has joined the room
    // First up, inform everyone that he has joined room
    socket.emit("joinRoom", { email: user.email, roomId });

    // Set up a listener for to listen when someone
    // else joins the room
    socket.on("userJoined", params => {
      console.log(`${params.email} connected...`);
    });

    // call and let the other user now that you have joined the room
    initiatorPeer.current = callUser();

    socket.on("receiveSignal", params => {
      // listener for receiving calls
      receiverPeer.current = acceptCall(params);
    });

    // Unsubscribe from socket listeners
    return () => {
      socket.off("userJoined");
      socket.off("receiveSignal");
      socket.off("acknowledgeSignal");
    };
  }, [roomId, user, callUser, acceptCall]);

  const changeVideoStream = React.useCallback((stream: MediaStream | null) => {
    setOwnVideoStream(stream);
    if (myVideoStream.current) {
      myVideoStream.current.srcObject = stream;
    }
  }, []);

  useEffect(() => {
    if (validated) return handleSocketListenersForJoinedRoom();
  }, [validated, handleSocketListenersForJoinedRoom]);

  useEffect(() => {
    const updateStreamForPeer = (peer?: Instance) => {
      if (!peer) return;

      const liveStreams = [...peer.streams];
      liveStreams.forEach(stream => peer.removeStream(stream));
      if (ownVideoStream) {
        peer.addStream(ownVideoStream);
      }
    };

    try {
      updateStreamForPeer(initiatorPeer.current);
    } catch (err) {
      console.error(err);
    }
    try {
      updateStreamForPeer(receiverPeer.current);
    } catch (err) {
      console.error(err);
    }
  }, [ownVideoStream]);

  return (
    <div id="vid-container" className="flex gap-standard">
      <MyVideo myMediaStream={myVideoStream} changeMediaStream={changeVideoStream} />
      <CustomVideo ref={otherVideoStream} isMuted={false} isCameraOff={false} isSelfVideo={false} />
    </div>
  );
};

export default Room;
