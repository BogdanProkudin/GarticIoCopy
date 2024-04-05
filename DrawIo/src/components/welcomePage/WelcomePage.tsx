import WelcomeInfo from "./WelcomeInfo";
import WelcomeText from "./WelcomeText";

import styles from "./styles.module.scss";
function WelcomePage() {
  return (
    <div className={styles.welcome_page_container}>
      <WelcomeText />
      <WelcomeInfo />
    </div>
  );
}

export default WelcomePage;
