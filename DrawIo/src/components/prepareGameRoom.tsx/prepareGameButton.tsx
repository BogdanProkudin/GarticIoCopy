import { useNavigate } from "react-router-dom";
import styles from "./styles.module.scss";
import axios from "axios";

import { useAppDispatch, useAppSelector } from "../../store/hook";

import { Dispatch, SetStateAction, useState } from "react";
import UserNameTookModal from "./RoomInfo/modal/userNameTookModal";
import { useGetRoomIdFromUrl } from "../../hooks/useGetRoomIdFromUrl";
import GameStartedErrorModal from "./RoomInfo/modal/gameStartedErrorModal";
import { setIsGameRoomLoading } from "../../store/slices/roomInfo";
type PrepareGameButtonProps = {
  setIsGameStartedError: Dispatch<SetStateAction<boolean>>;
  isGameStartedError: boolean;
  setIsUserNameTook: Dispatch<SetStateAction<boolean>>;
  isUserNameTook: boolean;
};
const PrepareGameButton: React.FC<PrepareGameButtonProps> = ({
  setIsGameStartedError,
  setIsUserNameTook,
}) => {
  const navigate = useNavigate();
  const userName = useAppSelector((state) => state.userAuth.userNameInputValue);
  const userAvatar = localStorage.getItem("userAvatar");
  const userNameStorage = localStorage.getItem("userName");
  const userId = localStorage.getItem("userId");
  const activeAvatar = useAppSelector((state) => state.userAuth.activeAvatar);
  const dispatch = useAppDispatch();
  const roomData = useAppSelector((state) => state.drawThema.roomData);
  const roomId = useGetRoomIdFromUrl();
  const handleJoinRoom = async () => {
    try {
      if (userName.length >= 3 && userName.length <= 24) {
        // const generatedUserId = generateUserId();

        const userIdExists = roomData.usersInfo.some((user: any) => {
          return user.userId === userId;
        });
        const userExists = roomData.usersInfo.some((user: any) => {
          return user.userName === userName;
        });

        setIsGameStartedError(false);
        if (roomData.isGameStarted) {
          setIsGameStartedError(true);
          return;
        }
        setIsUserNameTook(false);
        if (userExists || userIdExists) {
          setIsUserNameTook(true);
          console.log("error your id  already in the game");
          return;
        }
        dispatch(setIsGameRoomLoading(true));
        const response = await axios.post("http://localhost:3000/joinRoom", {
          roomId,
          userInfo: {
            userId: userId,
            userAvatar: activeAvatar ? activeAvatar : userAvatar && userAvatar,
            userName: userName.length > 1 ? userName : userNameStorage,
            userPoints: 0,
            isActive: false,
          },
        });
        console.log("REPSSS", response);

        localStorage.setItem("userName", userName);
        axios.post("http://localhost:3000/ping", { roomId, userId });
        navigate(`/game/${roomId}`, { replace: true });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error response:", error.response?.data); // Логируем ответ с ошибкой
        if (error.response?.status === 400) {
          console.log("REquest returns code 400");
          navigate("/LobbyNotFound", { replace: true });
          return;
          // Выполнить действия, если ошибка 404
        } else {
          console.log("An error occurred.");
          // Выполнить другие действия
        }
      } else {
        console.error("An unknown error occurred:", error);
      }
    }
  };

  return (
    <>
      <button
        onClick={() => handleJoinRoom()}
        className={styles.prepare_game_button}
      >
        <div className={styles.set_up_logo} />
        <strong>PLAY</strong>
      </button>
    </>
  );
};
export default PrepareGameButton;
