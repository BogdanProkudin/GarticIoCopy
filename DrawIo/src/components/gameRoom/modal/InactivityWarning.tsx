import React from "react";
import ReactModal from "react-modal";
import styles from "../../welcomePage/styles.module.scss";
import { MESSAGES } from "../../../constants/messages";
import Lottie from "react-lottie";
import animationData from "../../../tools/Animation - 1709999171287 (1).json";

interface InactivityWarningProps {
  isOpen: boolean;
  timeToDisconnect: number;
  onStayActive: () => void;
}

export const InactivityWarning: React.FC<InactivityWarningProps> = ({
  isOpen,
  timeToDisconnect,
  onStayActive,
}) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <ReactModal
      isOpen={isOpen}
      className={styles.modal_content}
      overlayClassName={styles.modal_overlay}
      ariaHideApp={false}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        content: {
          position: "relative",
          background: "#fff",
          borderRadius: "20px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          outline: "none",
          width: "517px",
          height: "358px",
        },
      }}
    >
      <div className={styles.userName_not_correct_title}>
        <h3>WARNING</h3>
      </div>
      <Lottie
        options={defaultOptions}
        height={170}
        width={250}
        style={{ marginTop: "0.6rem" }}
      />
      <span className={styles.userName_error_text}>
        {MESSAGES.INACTIVITY_WARNING.replace(
          "{time}",
          timeToDisconnect.toString()
        )}
      </span>
      <button
        onClick={onStayActive}
        className={styles.welcome_avatar_submit_button}
      >
        <div />
        <strong>STAY IN GAME</strong>
      </button>
    </ReactModal>
  );
};
