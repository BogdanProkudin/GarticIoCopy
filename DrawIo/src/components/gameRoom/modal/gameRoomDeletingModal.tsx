import React, { useEffect } from "react";
import ReactModal from "react-modal";

import { MESSAGES } from "../../../constants/messages";
import Lottie from "react-lottie";
import animationData from "../../../tools/Animation - 1734009134112.json";
import styles from "./styles.module.scss";
import { useNavigate } from "react-router-dom";

const DeleteModal = () => {
  const navigate = useNavigate();
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const onConfirm = () => {
    navigate("/", { replace: true });
  };
  useEffect(() => {
    setTimeout(() => {
      onConfirm();
    }, 10000);
  }, []);
  return (
    <ReactModal
      isOpen={true}
      className={styles.leave_warning_modal_content}
      overlayClassName={styles.modal_overlay}
      ariaHideApp={false}
    >
      <div className={styles.leave_modal_text}>
        <h3>Disconection...</h3>
      </div>
      <Lottie
        options={defaultOptions}
        height={170}
        width={250}
        style={{ marginTop: "0.6rem" }}
      />
      <span className={styles.leave_modal_description}>
        {MESSAGES.ONE_PLAYER_LEFT}
      </span>
      <div className={styles.buttons_container}>
        <button
          onClick={onConfirm}
          type="button"
          className={styles.leave_modal_submit_button}
        >
          <div />
          <strong>{"CONFIRM"}</strong>
        </button>
      </div>
    </ReactModal>
  );
};
export default DeleteModal;
