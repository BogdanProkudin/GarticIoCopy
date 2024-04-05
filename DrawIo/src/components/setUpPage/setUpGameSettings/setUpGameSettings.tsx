import styles from "../styles.module.scss";
import SetUpGameWrapperSettings from "./setUpGameWrapperSettings";
const SetUpGameSettings = () => {
  return (
    <div className={styles.set_up_settings_container}>
      <h1>1. SETTINGS</h1>
      <SetUpGameWrapperSettings />
    </div>
  );
};
export default SetUpGameSettings;
