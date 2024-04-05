import styles from "../styles.module.scss";
import Lottie from "react-lottie";
import LottieSettings from "../../../tools/Animation - 1712053642285.json";
import ProgressBar from "../Timers/IntervalTimer";
import InactiveTimer from "../Timers/InactiveTimer";
import { useAppSelector } from "../../../store/hook";

const BoardInactive = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,

    animationData: LottieSettings,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const activeUser = useAppSelector((state) => state.drawThema.activeUser);
  const userNameStorage = localStorage.getItem("userName");
  return (
    <div className={styles.your_turn_draw_container}>
      <h1>Inactive</h1>
      <Lottie
        style={{
          position: "absolute",
          height: "250px",
          width: "250px",
          top: "2.5rem",
          left: "13.6rem",
        }}
        options={defaultOptions}
        isClickToPauseDisabled
      />
      <span className={styles.game_room_inactive_small_text}>
        {activeUser.userName === userNameStorage
          ? `You've lost your the turn :(`
          : `User has  lost the turn :(`}
      </span>
      <InactiveTimer />
    </div>
  );
};
export default BoardInactive;
