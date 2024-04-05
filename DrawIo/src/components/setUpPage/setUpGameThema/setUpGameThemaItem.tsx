import styles from "../styles.module.scss";
import { IoIosCheckmarkCircle } from "react-icons/io";
type SetUpGameThemaItemProps = {
  icon: string;
  themaName: string;
};
const SetUpGameThemaItem: React.FC<SetUpGameThemaItemProps> = ({
  themaName,
  icon,
}) => {
  return (
    <>
      <div
        style={{ backgroundImage: `url(${icon})` }}
        className={styles.set_up_thema_item_icon}
      ></div>
      <h5>{themaName}</h5>
      <span>
        OFFICIAL
        <IoIosCheckmarkCircle
          style={{ paddingLeft: "5px" }}
          fontSize={20}
          color="blue"
        />
      </span>
    </>
  );
};
export default SetUpGameThemaItem;
