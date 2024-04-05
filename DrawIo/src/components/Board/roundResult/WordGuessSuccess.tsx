import styles from "../styles.module.scss";
import Lottie from "react-lottie";
import LottieSettings from "../../../tools/Animation - 1712255326889.json";
import InactiveTimer from "../Timers/InactiveTimer";
const WordGuessSuccess = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,

    animationData: LottieSettings,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div className={styles.container}>
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
          every body guessed correct
        </span>
        <InactiveTimer />
      </div>
    </div>
  );
};
export default WordGuessSuccess;
