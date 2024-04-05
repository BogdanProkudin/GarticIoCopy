import SetUpInfo from "./setUpInfo";
import SetUpUserInfo from "./setUpUserInfo";
import styles from "./styles.module.scss";
const SetUpPage = () => {
  return (
    <div className={styles.set_up_page_container}>
      <SetUpUserInfo />
      <SetUpInfo />
    </div>
  );
};
export default SetUpPage;
