import Lottie from "react-lottie";
import animationData from "../../../tools/Animation - 1721314176921.json";
import ReactModal from "react-modal";
import { FaRegCopy } from "react-icons/fa";

import styles from "../../welcomePage/styles.module.scss";
import { IoClose } from "react-icons/io5";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { useAppSelector } from "../../../store/hook";
type ShareShowModalProps = {
  setShowRulesModal: Dispatch<SetStateAction<boolean>>;
};
const RulesGameModal: React.FC<ShareShowModalProps> = ({
  setShowRulesModal,
}) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,

    animationData: animationData,

    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const selectedThema = useAppSelector(
    (state) => state.drawThema.selectedThema
  );
  const selectedPoints = useAppSelector(
    (state) => state.drawThema.selectedPoints
  );
  const selectedPlayers = useAppSelector(
    (state) => state.drawThema.selectedPlayers
  );
  const gameThemaInfo: { name: string; value: string | number }[] = [
    { name: "Thema:", value: selectedThema.name },
    { name: "Goal:", value: `${selectedPoints} points` },
    { name: "Players:", value: selectedPlayers },
  ];
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
          width: "600px",
          height: "400px",
        },
      }}
    >
      <div className={styles.userName_not_correct_title}>
        <h3>Rules</h3>
      </div>
      <IoClose
        onClick={() => setShowRulesModal(false)}
        color="black"
        fontSize={40}
        style={{
          position: "absolute",
          right: "10px",
          top: "10px",
          cursor: "pointer",
        }}
      />
      <div className={styles.modal_room_info_container}>
        {gameThemaInfo.map((item) => {
          return (
            <div className={styles.modal_room_info_item}>
              <span>{item.name}</span>
              <span style={{ color: "#0a7dfb" }}>{item.value}</span>
            </div>
          );
        })}
      </div>
      <Lottie
        options={defaultOptions}
        height={170}
        width={280}
        isClickToPauseDisabled
        style={{ marginTop: "0.6rem" }}
      />
      <span className={styles.userName_error_text}>Do not draw letters</span>

      <button
        onClick={() => setShowRulesModal(false)}
        className={styles.welcome_avatar_submit_button}
      >
        <div />
        <strong>Confirm</strong>
      </button>
    </ReactModal>
  );
};
export default RulesGameModal;
