import React from "react";
import ReactModal from "react-modal";
import styles from "../../welcomePage/styles.module.scss";
import { MESSAGES } from "../../../constants/messages";
import Lottie from "react-lottie";
import animationData from "../../../tools/Animation - 1709999171287 (1).json";

interface LeaveRoomConfirmationProps {
  isOpen: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const LeaveRoomConfirmation: React.FC<LeaveRoomConfirmationProps> = ({
  isOpen,
  isLoading = false,
  onConfirm,
  onCancel,
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
          zIndex: 1000,
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
        <h3>CONFIRMATION</h3>
      </div>
      <Lottie
        options={defaultOptions}
        height={170}
        width={250}
        style={{ marginTop: "0.6rem" }}
      />
      <span className={styles.userName_error_text}>
        {MESSAGES.LEAVE_CONFIRMATION}
      </span>
      <div className={styles.buttons_container}>
        <button
          onClick={onCancel}
          disabled={isLoading}
          className={styles.welcome_avatar_cancel_button}
        >
          <div />
          <strong>CANCEL</strong>
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className={styles.welcome_avatar_submit_button}
        >
          <div />
          <strong>{isLoading ? "LEAVING..." : "LEAVE"}</strong>
        </button>
      </div>
    </ReactModal>
  );
};
