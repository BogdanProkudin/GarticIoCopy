import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
const SetUpUserInfo = () => {
  const userName = localStorage.getItem("userName");
  const userAvatar = localStorage.getItem("userAvatar");
  const [generedUserName, setGeneredUserName] = useState("");
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery({ maxWidth: 580 });
  useEffect(() => {
    if (userName === null) {
      function generateRandomNumbers() {
        const numbers = [];
        for (let i = 0; i < 4; i++) {
          const randomNumber = Math.floor(Math.random() * 10);
          numbers.push(randomNumber);
        }
        return numbers.join("");
      }

      const randomNumbers = generateRandomNumbers();
      const generateUserName = `User${randomNumbers}`;
      localStorage.setItem("userName", generateUserName);
      setGeneredUserName(generateUserName);
    }
    if (userAvatar === null) {
      localStorage.setItem(
        "userAvatar",
        "https://gartic.io/static/images/avatar/svg/0.svg"
      );
    }
  }, []);
  return (
    <div className={styles.set_up_text_container}>
      {!isSmallScreen && (
        <>
          <div onClick={() => navigate("/")} className={styles.welcome_logo} />
          <div className={styles.set_up_user_info_container}>
            <span>{userName ? userName : generedUserName}</span>
            <div
              onClick={() => navigate("/")}
              className={styles.set_up_user_avatar_container}
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
export default SetUpUserInfo;
