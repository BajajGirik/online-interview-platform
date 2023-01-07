export const getUserMediaStream = (constraints: MediaStreamConstraints) => {
  return navigator.mediaDevices.getUserMedia(constraints);
};

export const removeAudioStream = (stream?: MediaStream) => {
  const audioTrack = stream?.getAudioTracks()[0];
  if (!audioTrack) return;

  audioTrack.stop();
};

export const removeVideoStream = (stream?: MediaStream) => {
  const videoTrack = stream?.getVideoTracks()[0];
  if (!videoTrack) return;

  videoTrack.stop();
};

export const removeAllStreams = (stream?: MediaStream) => {
  stream?.getTracks().forEach(track => track.stop());
};

/**
 * The below methods are really handy as we don't need to remove and get userMedia again
 * and again (which is an async function and takes some time to fetch the available devices)
 * when the user's turn off and on their camera and microphone. The downside of this method
 * is that when we make enabled = false, the camera stream shuts down, but the camera
 * light on the devices stay on indicating that camera is still in use even if we are
 * not using the stream and this doesn't look good from user's POV and security wise.
 ******************** Tested on MAC chrome as of now ************************************
 * TODO: See if we can somehow completely switch off the camera but keep the userMedia
 * for fast processing in the app. (Make sure the camera light stays shut when camera
 * not in use)
 */
export const toggleAudioStream = (stream?: MediaStream) => {
  const audioTrack = stream?.getAudioTracks()[0];
  if (!audioTrack) return;

  audioTrack.enabled = !audioTrack.enabled;
};

export const toggleVideoStream = (stream?: MediaStream) => {
  const videoStream = stream?.getVideoTracks()[0];
  if (!videoStream) return;

  videoStream.enabled = !videoStream.enabled;
};
