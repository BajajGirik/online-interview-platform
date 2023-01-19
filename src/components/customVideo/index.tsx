import React from "react";
import styles from "../../styles/customVideo.module.css";

type Props = {
  /**
   * "isSelfVideo" parameter is present to silently mute the user without showing it in
   * UI whenever the video is user's own video as the user doesn't want to listen to
   * his voice while he/she speaks.
   */
  isSelfVideo: boolean;
  isMuted: boolean;
  isCameraOff: boolean;
  toggleMute?: () => void;
  toggleCamera?: () => void;
};

const CustomVideo = React.forwardRef<HTMLVideoElement, Props>((props, ref) => {
  return (
    <div className={styles.video_container}>
      <video
        ref={ref}
        className={styles.video}
        muted={props.isSelfVideo || props.isMuted}
        autoPlay
      />

      <div className={`flex al-cen jus-cen w-100 ${styles.actions_tray}`}>
        <button className={styles.action_btn} onClick={props.toggleMute}>
          {props.isMuted ? "🔇" : "🔉"}
        </button>
        <button className={styles.action_btn} onClick={props.toggleCamera}>
          {props.isCameraOff ? "📷" : "📸"}
        </button>
        <button className={styles.action_btn}>Settings</button>
      </div>
    </div>
  );
});

export default React.memo(CustomVideo);
