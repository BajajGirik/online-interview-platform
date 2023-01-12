import React, { createContext, useRef, createRef } from "react";
// import socket from '../config/socket';
import Peer from "simple-peer";
import { getMediaStreamFromRef } from "../utils/navigator";

type Props = {
  children: React.ReactNode;
};

type SocketContextProviderType = {
  myVideoStream: React.MutableRefObject<HTMLVideoElement | null>;
  callUser: () => void;
};

const defaultSocketContextValue: SocketContextProviderType = {
  myVideoStream: createRef<HTMLVideoElement>(),
  callUser: () => {}
};

export const SocketContext = createContext<SocketContextProviderType>(defaultSocketContextValue);

const ContextProvider = ({ children }: Props) => {
  // const [callAccepted, setCallAccepted] = useState<boolean>(false);
  // const connectionRef = useRef();
  const myVideoStream = useRef<HTMLVideoElement>(null);
  // const userVideo = useRef<HTMLVideoElement>();

  const answerCall = () => {
    // setCallAccepted(true);

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: getMediaStreamFromRef(myVideoStream)
    });

    peer.on("signal", data => {
      // socket.emit('answerCall', { signal: data, to: call.from });
      console.log(data);
    });

    peer.on("stream", currentStream => {
      // userVideo.current.srcObject = currentStream;
      console.log(currentStream);
    });

    // peer.signal(call.signal);

    // connectionRef.current = peer;
  };

  return (
    <SocketContext.Provider
      value={{
        myVideoStream,
        callUser: answerCall
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default ContextProvider;
