import styles from "../styles.module.scss";
import GameRoomAnswers from "./answers/gameRoomAnswers";
const GameRoomInteractions = () => {
  return (
    <div className={styles.game_room_interaction}>
      <GameRoomAnswers />
    </div>
  );
};
export default GameRoomInteractions;
