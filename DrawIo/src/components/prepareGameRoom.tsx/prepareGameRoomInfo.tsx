import PrepareGameRoomData from "./RoomInfo/prepareGameRoomData";
import PrepareGameUserData from "./UserInfo/prepareGameUserData";
import PrepareGameButton from "./prepareGameButton";
import styles from "./styles.module.scss";
const PrepareGameRoomInfo = () => {
  return (
    <div className={styles.prepare_room_info_container}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,900;1,900&display=swap"
      />
      <div className={styles.welcome_prepare_room_container_play_image}>
        <div className={styles.welcome_info_play_image}>
          <h2>Join ROOM</h2>
        </div>
      </div>
      <div className={styles.prepare_game_room_info_container}>
        <PrepareGameUserData />
        <PrepareGameRoomData />
      </div>
      <PrepareGameButton />
    </div>
  );
};
export default PrepareGameRoomInfo;
