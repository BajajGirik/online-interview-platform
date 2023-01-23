import React, { useState, useCallback, memo } from "react";
import {
  getUserMediaStream,
  removeAllStreams,
  removeAudioStream,
  removeVideoStream
} from "../../utils/navigator";
import CustomVideo from "../customVideo";

type Props = {
  myMediaStream: React.MutableRefObject<HTMLVideoElement | null>;
  changeMediaStream: (stream: MediaStream | null) => void;
};

const MyVideo = memo((props: Props) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const { myMediaStream, changeMediaStream } = props;

  /**
   * @returns a boolean value indicating whether setting the
   * stream was a success (true) or a failure (false).
   */
  const setVideoStream = useCallback(
    async (video: boolean, audio: boolean): Promise<boolean> => {
      try {
        const stream = await getUserMediaStream({ video, audio });
        changeMediaStream(stream);
        return true;
      } catch (err) {
        alert("Unable to get Audio / Video stream");
        console.log((err as Error).message);

        changeMediaStream(null);
        setIsMuted(true);
        setIsCameraOff(true);

        return false;
      }
    },
    [changeMediaStream]
  );

  const toggleCamera = useCallback(async () => {
    if (!myMediaStream.current) return;

    if (!isCameraOff) {
      removeVideoStream(myMediaStream.current.srcObject as MediaStream);
      setIsCameraOff(prev => !prev);
      return;
    }

    removeAllStreams(myMediaStream.current.srcObject as MediaStream);
    const isSuccessful = await setVideoStream(true, !isMuted);

    isSuccessful && setIsCameraOff(prev => !prev);
  }, [isCameraOff, isMuted, setVideoStream]);

  const toggleAudio = useCallback(async () => {
    if (!myMediaStream.current) return;

    if (!isMuted) {
      removeAudioStream(myMediaStream.current.srcObject as MediaStream);
      setIsMuted(prev => !prev);
      return;
    }

    removeAllStreams(myMediaStream.current.srcObject as MediaStream);
    const isSuccessful = await setVideoStream(!isCameraOff, true);

    isSuccessful && setIsMuted(prev => !prev);
  }, [isCameraOff, isMuted, setVideoStream]);

  return (
    <CustomVideo
      ref={myMediaStream}
      isMuted={isMuted}
      isCameraOff={isCameraOff}
      toggleMute={toggleAudio}
      toggleCamera={toggleCamera}
      isSelfVideo
    />
  );
});

export default MyVideo;
