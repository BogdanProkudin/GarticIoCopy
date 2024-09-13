import styles from "./styles.module.scss";
import { HiVolumeUp } from "react-icons/hi";
import { FaShareAlt } from "react-icons/fa";
import { MdInfoOutline } from "react-icons/md";
import { FaXmark } from "react-icons/fa6";
import { Dispatch, SetStateAction } from "react";
type GameRoomHeaderProps = {
  setShowShareModal: Dispatch<SetStateAction<boolean>>;
  setShowRulesModal: Dispatch<SetStateAction<boolean>>;
};
const GameRoomHeader: React.FC<GameRoomHeaderProps> = ({
  setShowShareModal,
  setShowRulesModal,
}) => {
  return (
    <header>
      <div className={styles.welcome_game_room_logo}>
        <div></div>
      </div>
      <div>
        <div>
          <button className={styles.game_room_sound_button}>
            <HiVolumeUp fontSize={50} />
          </button>
          <button
            onClick={() => setShowShareModal(true)}
            className={styles.game_room_share_button}
          >
            <FaShareAlt fontSize={25} />
          </button>
        </div>
        <div
          onClick={() => setShowRulesModal(true)}
          className={styles.game_room_button_container}
        >
          <button className={styles.game_room_sound_button}>
            <MdInfoOutline fontSize={50} />
          </button>
          <button className={styles.game_room_share_button}>
            <FaXmark fontSize={32} />
          </button>
        </div>
      </div>
    </header>
  );
};
export default GameRoomHeader;
