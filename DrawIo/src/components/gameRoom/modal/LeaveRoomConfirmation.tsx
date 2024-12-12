import React from "react";
import ReactModal from "react-modal";

import { MESSAGES } from "../../../constants/messages";
import Lottie from "react-lottie";
import animationData from "../../../tools/Animation - 1734009134112.json";
import styles from "./styles.module.scss";
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
      className={styles.leave_warning_modal_content}
      overlayClassName={styles.modal_overlay}
      ariaHideApp={false}
    >
      <div className={styles.leave_modal_text}>
        <h3>Exit</h3>
      </div>
      <Lottie
        options={defaultOptions}
        height={170}
        width={250}
        style={{ marginTop: "0.6rem" }}
      />
      <span className={styles.leave_modal_description}>
        {MESSAGES.LEAVE_CONFIRMATION}
      </span>
      <div className={styles.buttons_container}>
        <button
          onClick={onCancel}
          disabled={isLoading}
          className={styles.leave_modal_cancel_button}
        >
          <div />
          <strong>NO</strong>
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className={styles.leave_modal_submit_button}
        >
          <div />
          <strong>{isLoading ? "LEAVING..." : "Yes"}</strong>
        </button>
      </div>
    </ReactModal>
  );
};
