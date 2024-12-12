import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { setIsUserNameError } from "../../../store/slices/userAuth";
import styles from "../styles.module.scss";
import { useNavigate } from "react-router-dom";
import { setIsUserJustLeftGame } from "../../../store/slices/userInfo";
import { useState } from "react";
const WelcomeConfirmButton = () => {
  const userId = localStorage.getItem("userId");
  const userName = useAppSelector((state) => state.userAuth.userNameInputValue);
  const userAvatar = useAppSelector((state) => state.userAuth.activeAvatar);
  const regex = /^[a-zA-Z0-9]{2,20}$/;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const isUserNameValid = async () => {
    if (regex.test(userName)) {
      // socket.connect();
      // const roomId = generateRoomId();
      // socket.emit("joinRoom", roomId);
      console.log("USSSSS", userId);
      setIsLoading(true);
      const response = await axios.post("http://localhost:3000/isUserInLobby", {
        userId,
      });
      if (response.data.message === "You are already in the room") {
        dispatch(setIsUserJustLeftGame(true));
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
      navigate(`/create`);
      localStorage.setItem("userName", userName);
      localStorage.setItem("userAvatar", userAvatar);
    } else {
      setIsLoading(false);
      dispatch(setIsUserNameError(true));
    }
  };

  return (
    <button
      id="creatUserButton"
      type="submit"
      onClick={isUserNameValid}
      className={styles.welcome_avatar_play_button}
    >
      <div />
      <strong>{isLoading ? "LOADING..." : "PLAY!"}</strong>
    </button>
  );
};
export default WelcomeConfirmButton;
