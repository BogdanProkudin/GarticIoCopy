import Lottie from "react-lottie";
import animationData from "../../../tools/Animation - 1709999171287 (1).json";
import ReactModal from "react-modal";
import styles from "../../welcomePage/styles.module.scss";

import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { useNavigate } from "react-router-dom";

const DisconnectedModal = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const closeModal = () => {
    navigate("/");
  };
  return (
    <ReactModal
      isOpen={true}
      onRequestClose={closeModal}
      className={styles.modal_content}
      overlayClassName={styles.modal_overlay}
      ariaHideApp={false}
      contentLabel="Example Modal"
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        content: {
          width: "517px",
          height: "358px",
        },
      }}
    >
      <div className={styles.userName_not_correct_title}>
        <h3>ALERT</h3>
      </div>
      <Lottie
        options={defaultOptions}
        height={170}
        width={250}
        style={{ marginTop: "0.6rem" }}
      />
      <span className={styles.userName_error_text}>
        You have been disconnected due to inactivity.
      </span>
      <button
        onClick={closeModal}
        className={styles.welcome_avatar_submit_button}
      >
        <div />
        <strong>CONFIRM</strong>
      </button>
    </ReactModal>
  );
};

export default DisconnectedModal;
