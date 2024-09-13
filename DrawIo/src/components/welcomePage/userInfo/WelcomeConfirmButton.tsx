import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { setIsUserNameError } from "../../../store/slices/userAuth";
import styles from "../styles.module.scss";
import { useNavigate } from "react-router-dom";
const WelcomeConfirmButton = () => {
  const userName = useAppSelector((state) => state.userAuth.userNameInputValue);
  const userAvatar = useAppSelector((state) => state.userAuth.activeAvatar);
  const regex = /^[a-zA-Z0-9]{2,20}$/;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isUserNameValid = () => {
    if (regex.test(userName)) {
      // socket.connect();
      // const roomId = generateRoomId();
      // socket.emit("joinRoom", roomId);
      navigate(`/create`);
      localStorage.setItem("userName", userName);
      localStorage.setItem("userAvatar", userAvatar);
    } else {
      dispatch(setIsUserNameError(true));
    }
  };

  return (
    <button
      onClick={isUserNameValid}
      className={styles.welcome_avatar_play_button}
    >
      <div />
      <strong>PLAY!</strong>
    </button>
  );
};
export default WelcomeConfirmButton;
