import React, { createContext, useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";

// const socket = io('http://localhost:5000');
const socket = io(process.env.REACT_APP_BACKEND_URL || "");

type Props = {
  children: React.ReactNode;
};

type CallType = {
  from: string;
  isReceivingCall: boolean;
  name: string;
  callerName: string;
  signal: any;
};

type SocketContextType = {
  call: any;
  callAccepted: boolean;
  myVideo: any;
  userVideo: any;
  stream: any;
  name: string;
  setNameUtility: any;
  callEnded: boolean;
  me: string;
  callUser: any;
  leaveCall: () => void;
  answerCall: () => void;
};

const defaultSocketContextValues = {
  call: {},
  callAccepted: false,
  myVideo: null,
  userVideo: null,
  stream: null,
  name: "",
  setNameUtility: () => {},
  callEnded: true,
  me: "",
  callUser: {
    from: "",
    isReceivingCall: false,
    name: "",
    callerName: "",
    signal: null
  },
  leaveCall: () => {},
  answerCall: () => {}
};

const SocketContext = createContext<SocketContextType>(defaultSocketContextValues);

const SocketContextProvider = ({ children }: Props) => {
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState<MediaStream>();
  const [name, setName] = useState("");
  const [call, setCall] = useState<CallType>({
    isReceivingCall: false,
    from: "",
    name: "",
    callerName: "",
    signal: null
  });
  const [me, setMe] = useState("");

  const myVideo = useRef<HTMLVideoElement>();
  const userVideo = useRef<HTMLVideoElement>();
  const connectionRef = useRef<Peer.Instance>();

  const setNameUtility = (newName: string) => {
    setName(newName);
  };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(currentStream => {
        setStream(currentStream);
        if (myVideo.current) myVideo.current.srcObject = currentStream;
      })
      .catch(err => {
        console.log(err);
      });

    socket.on("me", id => setMe(id));

    socket.on("callUser", ({ from, name: callerName, signal }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal } as CallType);
    });
  }, []);

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", data => {
      socket.emit("answerCall", { signal: data, to: call.from });
    });

    peer.on("stream", currentStream => {
      if (userVideo.current) userVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  const callUser = (id: string) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", data => {
      socket.emit("callUser", { userToCall: id, signalData: data, from: me, name });
    });

    peer.on("stream", currentStream => {
      if (userVideo.current) userVideo.current.srcObject = currentStream;
    });

    socket.on("callAccepted", signal => {
      setCallAccepted(true);

      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);

    if (connectionRef.current) connectionRef.current.destroy();

    window.location.reload();
  };

  return (
    <SocketContext.Provider
      value={{
        call,
        callAccepted,
        myVideo,
        userVideo,
        stream,
        name,
        setNameUtility,
        callEnded,
        me,
        callUser,
        leaveCall,
        answerCall
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContextProvider, SocketContext };
