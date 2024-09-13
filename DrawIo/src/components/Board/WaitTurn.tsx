import { memo } from "react";
import { useAppSelector } from "../../store/hook";
import ProgressBar from "./Timers/IntervalTimer";
import styles from "./styles.module.scss";
const WaitTurn = () => {
  const activeUser = useAppSelector((state) => state.drawThema.activeUser);

  return (
    <div className={styles.your_turn_draw_container}>
      <h1>NEW TURN</h1>
      <div
        className={styles.wait_turn_user_image}
        style={{
          backgroundImage: `url(${
            activeUser.userAvatar && activeUser.userAvatar
          })`,
          marginTop:
            activeUser.userAvatar && activeUser.userAvatar.length > 70
              ? "-0.7rem"
              : "",
          borderRadius:
            activeUser.userAvatar && activeUser.userAvatar.length > 70
              ? "100%"
              : "",
        }}
      ></div>
      <span style={{ marginTop: "2.4rem" }}>It`s the turn of </span>
      <strong>{activeUser.userName}</strong>
      <ProgressBar />
    </div>
  );
};
export default memo(WaitTurn);
