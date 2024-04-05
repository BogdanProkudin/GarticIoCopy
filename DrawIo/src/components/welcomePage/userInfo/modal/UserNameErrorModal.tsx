import Lottie from "react-lottie";
import animationData from "../../../../tools/Animation - 1710000131286.json";
import ReactModal from "react-modal";
import styles from "../../styles.module.scss";

import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { setIsUserNameError } from "../../../../store/slices/userAuth";

const UserNameErrorModal: React.FC = () => {
  const isUserNameError = useAppSelector(
    (state) => state.userAuth.isUserNameError
  );
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
    dispatch(setIsUserNameError(false));
  };
  return (
    <ReactModal
      isOpen={isUserNameError}
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
        height={150}
        width={250}
        style={{ marginTop: "0.6rem" }}
      />
      <span className={styles.userName_error_text}>
        Invalid nickname: It must contain at least 2 characters, without special
        characters.
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
export default UserNameErrorModal;
