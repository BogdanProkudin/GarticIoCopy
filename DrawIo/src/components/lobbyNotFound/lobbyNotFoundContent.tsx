import { useNavigate } from "react-router-dom";
import LottieSettings from "../../tools/Animation - 1725570863520.json";
import styles from "./styles.module.scss";
import Lottie from "react-lottie";
const LobbyNotFoundContent = () => {
  const navigate = useNavigate();
  const defaultOptions = {
    loop: true,
    autoplay: true,

    animationData: LottieSettings,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div className={styles.lobby_not_found_content_container}>
      <h1>Room is not found :(</h1>
      <h2>The game is over or all users left the room</h2>
      <div className={styles.lottie_container}>
        <Lottie
          isClickToPauseDisabled
          options={defaultOptions}
          style={{ height: "250px", width: "250px" }}
        />
      </div>
      <button
        onClick={() => navigate("/")}
        className={styles.lobby_not_found_button}
      >
        <div className={styles.set_up_logo} />
        <strong>Back</strong>
      </button>
    </div>
  );
};

export default LobbyNotFoundContent;
