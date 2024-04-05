import { useAppSelector } from "../../../store/hook";
import styles from "../styles.module.scss";
import GameRoomUserItem, { GameRoomUserItemProps } from "./gameRoomUserItem";
const GameRoomUserList = () => {
  const roomUsers = useAppSelector((state) => state.drawThema.roomUsers);
  const selectedPlayers = useAppSelector(
    (state) => state.drawThema.selectedPlayers
  );
  if (!roomUsers) {
    return <div>LOADING ROOM USERS</div>;
  }
  const emptySlots = Array.from({ length: selectedPlayers });

  return (
    <div className={styles.game_room_user_list_container}>
      {emptySlots.map((_, index) => {
        return (
          <div key={index} className={styles.game_room_user}>
            <GameRoomUserItem
              userAvatar={roomUsers[index] && roomUsers[index].userAvatar}
              userName={roomUsers[index] && roomUsers[index].userName}
              userPoints={roomUsers[index] && roomUsers[index].userPoints}
            />
          </div>
        );
      })}
    </div>
  );
};

export default GameRoomUserList;
