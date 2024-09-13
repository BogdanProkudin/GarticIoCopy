import Lottie from "react-lottie";
import animationData from "../../../tools/Animation - 1721129440393.json";
import ReactModal from "react-modal";
import { FaRegCopy } from "react-icons/fa";

import styles from "../../welcomePage/styles.module.scss";
import { IoClose } from "react-icons/io5";
import { Dispatch, SetStateAction, useRef, useState } from "react";
type ShareShowModalProps = {
  setShowShareModal: Dispatch<SetStateAction<boolean>>;
};
const ShareGameModal: React.FC<ShareShowModalProps> = ({
  setShowShareModal,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [copySuccess, setCopySuccess] = useState<string>("");

  const copyToClipboard = () => {
    if (inputRef.current) {
      const inputValue = inputRef.current.value;
      navigator.clipboard.writeText(inputValue).then(
        () => {
          setCopySuccess("LINK COPIED!");
        },
        (err) => {
          setCopySuccess("Ошибка при копировании!");
          console.error("Ошибка копирования текста: ", err);
        }
      );
    }
  };
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
      isOpen={true}
      className={styles.modal_content}
      overlayClassName={styles.modal_overlay}
      ariaHideApp={false}
      contentLabel="Example Modal"
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: "999",
        },
        content: {
          width: "517px",
          height: "400px",
        },
      }}
    >
      <div className={styles.userName_not_correct_title}>
        <h3>Share </h3>
      </div>
      <IoClose
        onClick={() => setShowShareModal(false)}
        color="black"
        fontSize={40}
        style={{
          position: "absolute",
          right: "10px",
          top: "10px",
          cursor: "pointer",
        }}
      />
      <Lottie
        options={defaultOptions}
        height={170}
        width={250}
        isClickToPauseDisabled
        style={{ marginTop: "0.6rem" }}
      />
      <span className={styles.userName_error_text}>
        Invite your friends to the room! Send the link below:
      </span>
      <input
        ref={inputRef}
        className={styles.send_link_input}
        value={window.location.href}
        disabled
      />
      {copySuccess.length > 1 && (
        <span className={styles.copy_succes_text}>{copySuccess}</span>
      )}
      <button
        style={{ marginTop: copySuccess.length > 1 ? "0.3rem" : "0.7rem" }}
        onClick={copyToClipboard}
        className={styles.welcome_avatar_submit_button}
      >
        <FaRegCopy
          color="white"
          fontSize={24}
          className={styles.copy_link_icon}
        />
        <strong>Copy</strong>
      </button>
    </ReactModal>
  );
};
export default ShareGameModal;
