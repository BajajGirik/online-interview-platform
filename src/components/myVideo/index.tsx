import React, { useEffect, useState, useCallback, useContext } from "react";
import {
  getUserMediaStream,
  removeAllStreams,
  removeAudioStream,
  removeVideoStream
} from "../../utils/navigator";
import CustomVideo from "../customVideo";
import { SocketContext } from "../../context";

const MyVideo = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const { myVideoStream } = useContext(SocketContext);

  /**
   * @returns a boolean value indicating whether setting the
   * stream was a success (true) or a failure (false).
   */
  const setVideoStream = useCallback(async (video: boolean, audio: boolean): Promise<boolean> => {
    // This case shouldn't hit
    if (!myVideoStream.current) return false;

    try {
      myVideoStream.current.srcObject = await getUserMediaStream({ video, audio });
      return true;
    } catch (err) {
      alert("Unable to get Audio / Video stream");
      console.log((err as Error).message);

      myVideoStream.current.srcObject = null;
      setIsMuted(true);
      setIsCameraOff(true);

      return false;
    }
  }, []);

  const toggleCamera = useCallback(async () => {
    if (!myVideoStream.current) return;

    if (!isCameraOff) {
      removeVideoStream(myVideoStream.current.srcObject as MediaStream);
      setIsCameraOff(prev => !prev);
      return;
    }

    removeAllStreams(myVideoStream.current.srcObject as MediaStream);
    const isSuccessful = await setVideoStream(true, !isMuted);

    isSuccessful && setIsCameraOff(prev => !prev);
  }, [isCameraOff, isMuted, setVideoStream]);

  const toggleAudio = useCallback(async () => {
    if (!myVideoStream.current) return;

    if (!isMuted) {
      removeAudioStream(myVideoStream.current.srcObject as MediaStream);
      setIsMuted(prev => !prev);
      return;
    }

    removeAllStreams(myVideoStream.current.srcObject as MediaStream);
    const isSuccessful = await setVideoStream(!isCameraOff, true);

    isSuccessful && setIsMuted(prev => !prev);
  }, [isCameraOff, isMuted, setVideoStream]);

  useEffect(() => {
    setVideoStream(true, true);
  }, [setVideoStream]);

  return (
    <CustomVideo
      ref={myVideoStream}
      isMuted={isMuted}
      isCameraOff={isCameraOff}
      toggleMute={toggleAudio}
      toggleCamera={toggleCamera}
      isSelfVideo
    />
  );
};

export default MyVideo;
