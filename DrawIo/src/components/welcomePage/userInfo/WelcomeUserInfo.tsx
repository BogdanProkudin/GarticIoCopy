import WelcomeUserAvatar from "./WelcomeUserAvatar";
import styles from "../styles.module.scss";
import WelcomeUserName from "./WelcomeUserName";
import WelcomeConfirmButton from "./WelcomeConfirmButton";
function WelcomeUserInfo() {
  return (
    <div className={styles.welcome_user_info_container}>
      <h3>QUICK PLAY</h3>
      <WelcomeUserAvatar />
      <WelcomeUserName />
      <WelcomeConfirmButton />
    </div>
  );
}
export default WelcomeUserInfo;
