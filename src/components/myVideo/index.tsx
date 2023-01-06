import React, { useEffect, useRef } from "react";

const MyVideo = () => {
  const myVideoStream = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true
      })
      .then(stream => {
        if (!myVideoStream.current) return;
        myVideoStream.current.srcObject = stream;
      })
      .catch(error => alert((error as Error).message));
  }, []);

  return (
    <>
      <video autoPlay ref={myVideoStream} muted />
    </>
  );
};

export default MyVideo;
