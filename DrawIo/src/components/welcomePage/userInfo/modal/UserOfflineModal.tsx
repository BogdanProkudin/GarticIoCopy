import Lottie from "react-lottie";
import animationData from "../../../../tools/Animation - 1710000131286.json";
import ReactModal from "react-modal";
import styles from "../../styles.module.scss";

import { useAppDispatch, useAppSelector } from "../../../../store/hook";

import { setIsUserOnline } from "../../../../store/slices/userInfo";

const UserOfflineModal: React.FC = () => {
  const isUserOnline = useAppSelector((state) => state.userInfo.isUserOnline);
  const dispatch = useAppDispatch();
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const closeModal = () => {
    dispatch(setIsUserOnline(true));
  };
  return (
    <ReactModal
      isOpen={!isUserOnline}
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
        <h3 style={{ fontSize: "20px" }}>Connection Lost</h3>
      </div>
      <Lottie
        options={defaultOptions}
        height={150}
        width={250}
        style={{ marginTop: "0.6rem" }}
      />
      <span className={styles.userName_error_text}>
        It seems you've lost your internet connection. Please check your network
        settings and try again.
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
export default UserOfflineModal;
