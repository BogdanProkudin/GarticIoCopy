import axios from "axios";
import { IRoomData, setIsGameRoomLoading } from "../store/slices/roomInfo";
import { useAppDispatch } from "../store/hook";
import { useNavigate } from "react-router-dom";
import { Dispatch, SetStateAction } from "react";
interface IuseJoinGameRoom {
  userName: string;
  roomData: IRoomData;
  roomId: string;
  userId: string;
  setIsGameStartedError: Dispatch<SetStateAction<boolean>>;
  activeAvatar: string;
  userAvatar: string;
  userNameStorage: string;
  setIsUserNameTook: Dispatch<SetStateAction<boolean>>;
}
export const useJoinGameRoom = ({
  userName,
  roomData,
  roomId,
  userId,
  setIsGameStartedError,
  activeAvatar,
  userAvatar,
  userNameStorage,
  setIsUserNameTook,
}: IuseJoinGameRoom) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
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
  return handleJoinRoom;
};
