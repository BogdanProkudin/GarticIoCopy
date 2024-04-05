import { useNavigate } from "react-router-dom";
import styles from "./styles.module.scss";

import { useAppSelector } from "../../store/hook";
const PrepareGameUserInfo = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName");
  const userAvatar = localStorage.getItem("userAvatar");
  const activeAvatar = useAppSelector((state) => state.userAuth.activeAvatar);
  return (
    <div className={styles.prepare_room_text_container}>
      <div onClick={() => navigate("/")} className={styles.welcome_logo} />
      <div className={styles.prepare_room_user_info_container}>
        <span>{userName ? userName : "User123"}</span>
        <div
          onClick={() => navigate("/")}
          className={styles.prepare_room_user_avatar_container}
        >
          <div
            style={{
              backgroundImage: `url(${
                activeAvatar
                  ? activeAvatar
                  : userAvatar
                  ? userAvatar
                  : "https://gartic.io/static/images/avatar/svg/0.svg"
              })`,
              height: userAvatar && userAvatar?.length > 60 ? "51px" : "",
              borderRadius: userAvatar && userAvatar?.length > 60 ? "100%" : "",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PrepareGameUserInfo;
