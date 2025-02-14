import styles from "../setUpPage/styles.module.scss";
import Lottie from "react-lottie";
import LottieSettings from "../../tools/Animation - 1725791635271.json";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: LottieSettings,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};
const Loading = () => {
  return (
    <div className={styles.set_up_loading}>
      <Lottie
        isClickToPauseDisabled
        style={{ height: "300px", width: "300px" }}
        options={defaultOptions}
      />
    </div>
  );
};

export default Loading;
