import WelcomeUserInfo from "./userInfo/WelcomeUserInfo";
import styles from "./styles.module.scss";
function WelcomeInfo() {
  return (
    <div className={styles.welcome_info_container}>
      <div className={styles.welcome_info_container_play_image}>
        <div className={styles.welcome_info_play_image}>
          <h2>PLAY</h2>
        </div>
      </div>
      <WelcomeUserInfo />
    </div>
  );
}
export default WelcomeInfo;
