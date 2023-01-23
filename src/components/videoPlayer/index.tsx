import React, { useContext } from "react";
import { SocketContext } from "../../context/socketContext";

const VideoPlayer = () => {
  const {
    // name,
    callAccepted,
    myVideo,
    userVideo,
    callEnded,
    stream
    // call
  } = useContext(SocketContext);

  console.log(stream);
  console.log(myVideo.current?.srcObject);

  return (
    <div>
      <video playsInline muted ref={myVideo} autoPlay height="200px" width="200px" />
      <video
        playsInline
        ref={userVideo}
        autoPlay
        style={{ display: callAccepted && !callEnded ? "block" : "none" }}
      />
    </div>
  );
};

export default VideoPlayer;
