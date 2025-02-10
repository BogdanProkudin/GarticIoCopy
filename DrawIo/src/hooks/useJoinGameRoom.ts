import axios from "axios";
import { IRoomData, setIsGameRoomLoading } from "../store/slices/roomInfo";
import { useAppDispatch } from "../store/hook";
import { useNavigate } from "react-router-dom";
import { Dispatch, SetStateAction } from "react";

// Interface for Props
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

// API Endpoint & Messages Constants
const API_ENDPOINT = "http://localhost:3000/joinRoom";
const ERROR_MESSAGES = {
  NAME_TAKEN: "You are already in the room or userName taken",
  REQUEST_FAILED: "Request returned status 400",
  LOBBY_NOT_FOUND: "/LobbyNotFound",
  UNKNOWN_ERROR: "An unknown error occurred.",
};

// Main Hook
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

  // Helper: Check if User Exists in Room
  const doesUserExist = (
    roomData: IRoomData,
    userId: string,
    userName: string
  ) => {
    const userIdExists = roomData.usersInfo.some(
      (user) => user.userId === userId
    );
    const userNameExists = roomData.usersInfo.some(
      (user) => user.userName === userName
    );
    return { userIdExists, userNameExists };
  };

  // Helper: Construct User Info Object
  const getUserInfo = () => ({
    userId,
    userAvatar: activeAvatar || userAvatar,
    userName: userName || userNameStorage,
    userPoints: 0,
    isActive: false,
  });

  // Main Handler
  const handleJoinRoom = async () => {
    if (userName.length < 3 || userName.length > 24) return;

    try {
      const { userIdExists, userNameExists } = doesUserExist(
        roomData,
        userId,
        userName
      );

      // Check if Game Has Started
      if (roomData.isGameStarted) {
        setIsGameStartedError(true);
        return;
      }

      // Optional: Handle Username Already Exists Logic (if uncommented)
      if (userIdExists || userNameExists) {
        setIsUserNameTook(true);
        return;
      }

      // API Request
      const response = await axios.post(API_ENDPOINT, {
        roomId,
        userInfo: getUserInfo(),
      });

      // Handle Specific Error Response
      if (response.data.message === ERROR_MESSAGES.NAME_TAKEN) {
        setIsUserNameTook(true);
        return;
      }

      // Success: Store Name and Navigate
      localStorage.setItem("userName", userName);
      navigate(`/game/${roomId}`, { replace: true });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error response:", error.response?.data);
        if (error.response?.status === 400) {
          navigate(ERROR_MESSAGES.LOBBY_NOT_FOUND, { replace: true });
          return;
        }
      }

      console.error(ERROR_MESSAGES.UNKNOWN_ERROR, error);
    } finally {
    }
  };

  return handleJoinRoom;
};
