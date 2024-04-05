import { FaPen } from "react-icons/fa6";
import styles from "../styles.module.scss";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { setUserNameInputValue } from "../../../store/slices/userAuth";
import PrepareRoomChangeAvatarModal from "../modal/prepareRoomChangeAvatarModal";
const PrepareGameUserData = () => {
  const [generedUserName, setGeneredUserName] = useState("");
  const userName = localStorage.getItem("userName");
  const userAvatar = localStorage.getItem("userAvatar");
  const activeAvatar = useAppSelector((state) => state.userAuth.activeAvatar);
  const dispatch = useAppDispatch();
  const userNameInputValue = useAppSelector(
    (state) => state.userAuth.userNameInputValue
  );
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => {
    setIsOpen(true);
  };
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const inputValue = event.target.value;
    dispatch(setUserNameInputValue(inputValue));
  };
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
      setGeneredUserName(`User${generateUserName}`);
    }
    if (userAvatar === null) {
      localStorage.setItem(
        "userAvatar",
        "https://gartic.io/static/images/avatar/svg/0.svg"
      );
    }
  }, []);

  return (
    <div className={styles.prepare_game_user_data_container}>
      <h3>YOUR INFORMATION</h3>
      <div className={styles.prepare_game_user_container}>
        <div className={styles.prepare_game_user_avatar_container}>
          <div
            style={{
              backgroundImage: `url(${
                activeAvatar.length === 0 ? userAvatar : activeAvatar
              })`,
              height: activeAvatar.length > 60 ? "91px" : "",
              borderRadius: activeAvatar.length > 60 ? "100%" : "",
              // height:
              //   !activeAvatar && userAvatar && userAvatar.length > 60
              //     ? "91px"
              //     : "",
              // borderRadius:
              //   !activeAvatar && userAvatar && userAvatar.length > 60
              //     ? "100%"
              //     : "",
            }}
            className={styles.prepare_game_user_avatar}
          />
          <button
            onClick={() => openModal()}
            className={styles.prepare_game_select_avatar}
          >
            <FaPen color="white" fontSize={19} />
          </button>
        </div>
        <input
          onChange={(e) => handleInputChange(e)}
          placeholder={userName ? userName : userNameInputValue}
          className={styles.prepare_game_userName_input}
        />
        <PrepareRoomChangeAvatarModal isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
    </div>
  );
};
export default PrepareGameUserData;
