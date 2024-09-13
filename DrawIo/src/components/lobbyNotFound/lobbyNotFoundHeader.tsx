import { useNavigate } from "react-router-dom";
import stylesFromSetUp from "../setUpPage/styles.module.scss";
import styles from "./styles.module.scss";
import { useMediaQuery } from "react-responsive";
const LobbyNotFoundHeader = () => {
  const userName = localStorage.getItem("userName");
  const userAvatar = localStorage.getItem("userAvatar");
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery({ maxWidth: 580 });
  return (
    <div className={styles.lobby_not_found_header_container}>
      {!isSmallScreen && (
        <>
          <div onClick={() => navigate("/")} className={styles.welcome_logo} />
          <div className={styles.lobby_not_found_user_info_container}>
            <span>{userName ? userName : "User8912"}</span>
            <div
              onClick={() => navigate("/")}
              className={styles.lobby_not_found_user_avatar_container}
            >
              <div
                style={{
                  backgroundImage: `url(${
                    userAvatar
                      ? userAvatar
                      : "https://gartic.io/static/images/avatar/svg/1.svg"
                  })`,
                  height: userAvatar && userAvatar?.length > 60 ? "51px" : "",
                  borderRadius:
                    userAvatar && userAvatar?.length > 60 ? "100%" : "",
                }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default LobbyNotFoundHeader;
