import SetUpGameThemaTitle from "./setUpGameThemaTitle";
import styles from "../styles.module.scss";
import SetUpThemaList from "./setUpTGameThemaList";

const SetUpGameThema = () => {
  return (
    <div className={styles.set_up_thema_container}>
      <SetUpGameThemaTitle />
      <SetUpThemaList />
    </div>
  );
};
export default SetUpGameThema;
