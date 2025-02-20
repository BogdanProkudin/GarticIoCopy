import { useState } from "react";

import { useGetRoomIdFromUrl } from "../../hooks/useGetRoomIdFromUrl";
import { useJoinGameRoom } from "../../hooks/useJoinGameRoom";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import styles from "./styles.module.scss";
import { setIsUserNameError } from "../../store/slices/userAuth";
interface PrepareGameButtonProps {
  setIsGameStartedError: React.Dispatch<React.SetStateAction<boolean>>;
  setIsUserNameTook: React.Dispatch<React.SetStateAction<boolean>>;
}

const PrepareGameButton: React.FC<PrepareGameButtonProps> = ({
  setIsGameStartedError,
  setIsUserNameTook,
}) => {
  const userName = useAppSelector((state) => state.userAuth.userNameInputValue);
  const activeAvatar = useAppSelector((state) => state.userAuth.activeAvatar);
  const roomData = useAppSelector((state) => state.drawThema.roomData);
  const userAvatar = localStorage.getItem("userAvatar");
  const userNameStorage = localStorage.getItem("userName");
  const userId = localStorage.getItem("userId");
  const roomId = useGetRoomIdFromUrl();
  const regex = /^[a-zA-Z0-9]{2,20}$/;
  const [isSending, setIsSending] = useState(false);
  const dispatch = useAppDispatch();
  // Вызов хука на верхнем уровне
  const handleJoinRoom = useJoinGameRoom({
    userAvatar,
    setIsGameStartedError,
    userId,
    userName,
    roomData,
    roomId,
    activeAvatar,
    setIsUserNameTook,
    userNameStorage,
  });

  const handleButtonClick = async () => {
    setIsSending(true);
    if (!regex.test(userName)) {
      dispatch(setIsUserNameError(true));
      setIsSending(false);
      return;
    }
    dispatch(setIsUserNameError(false));
    await handleJoinRoom(); // Асинхронный вызов
    setIsSending(false);
  };

  return (
    <button onClick={handleButtonClick} className={styles.prepare_game_button}>
      <div className={styles.set_up_logo} />
      <strong>{isSending ? "JOINING..." : "PLAY"}</strong>
    </button>
  );
};

export default PrepareGameButton;
