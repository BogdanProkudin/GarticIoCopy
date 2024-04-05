import styles from "../styles.module.scss";
import { FaRegUser } from "react-icons/fa";
import SetUpSelectPlayers from "./setUpSelectPlayers";
import { TfiCup } from "react-icons/tfi";
import SetUpSelectPoints from "./setUpSelectPoints";
const SetUpGameWrapperSettings = () => {
  return (
    <div className={styles.set_up_setting_items_container}>
      <div className={styles.set_up_player_count_container}>
        <div className={styles.set_up_players_wrapper_items}>
          <FaRegUser className={styles.set_up_player_icon} color="blue" />
          <span>PLAYERS</span>
        </div>
        <SetUpSelectPlayers />
      </div>
      <div className={styles.set_up_points_container}>
        <div className={styles.set_up_points_wrapper_items}>
          <TfiCup className={styles.set_up_points_icon} color="blue" />
          <span>POINTS</span>
        </div>
        <SetUpSelectPoints />
      </div>
    </div>
  );
};
export default SetUpGameWrapperSettings;
