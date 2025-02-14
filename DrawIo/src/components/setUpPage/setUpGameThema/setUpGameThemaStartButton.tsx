import { useAppDispatch, useAppSelector } from "../../../store/hook";
import styles from "../styles.module.scss";
import { socket } from "../../../socket";
import { useNavigate } from "react-router-dom";
import {
  createRoom,
  resetGameState,
  setIsGameRoomLoading,
} from "../../../store/slices/roomInfo";

import {
  resetUserInfoState,
  setIsUserJustLeftGame,
} from "../../../store/slices/userInfo";
import { useState } from "react";

interface themaProps {
  name: string;
  icon: string;
  words: string[];
}
export interface roomDataProps {
  host: { hostName: string | null; hostId: string | null };
  points: number;
  players: number;
  thema: themaProps;
  roomId: string;
  isInGame?: boolean;
  usersInfo: [
    {
      userId: string | null;
      userAvatar: string | null;
      userName: string | null;
      userPoints: number;
      isActive: boolean;
      isInLobby?: boolean;
    }
  ];
}
const SetUpGameThemaStartButton = () => {
  const hostUserName = localStorage.getItem("userName");
  const userAvatar = localStorage.getItem("userAvatar");
  const [isLoadingRoom, setIsLoadingRoom] = useState(false);
  const dispatch = useAppDispatch();
  const userId = localStorage.getItem("userId");
  const selectedThema = useAppSelector(
    (state) => state.drawThema.selectedThema
  );
  const selectedPlayers = useAppSelector(
    (state) => state.drawThema.selectedPlayers
  );
  const selectedPoints = useAppSelector(
    (state) => state.drawThema.selectedPoints
  );
  const navigate = useNavigate();
  function generateRoomId() {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  function generateUserId() {
    if (!userId) {
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let result = "";
      const charactersLength = characters.length;
      for (let i = 0; i < 6; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    } else {
      return userId;
    }
  }
  const handleCreateNewRoom = async () => {
    if (selectedThema.name.length !== 0) {
      const roomId = await generateRoomId();
      const generatedUserId = await generateUserId();
      setIsLoadingRoom(true);
      const roomData: roomDataProps = {
        usersInfo: [
          {
            userId: userId,
            userAvatar,
            userName: hostUserName,
            userPoints: 0,
            isActive: false,
          },
        ],
        host: { hostName: hostUserName, hostId: generatedUserId },
        points: selectedPoints,
        players: selectedPlayers,
        thema: selectedThema,
        roomId: roomId,
      };
      const response = await dispatch(createRoom(roomData));

      if (response.payload.message === "You are already in the room") {
        dispatch(setIsUserJustLeftGame(true));
        setIsGameRoomLoading(false);
        return;
      }
      dispatch(resetGameState());
      dispatch(resetUserInfoState());
      dispatch(setIsGameRoomLoading(true));

      socket.connect();

      socket.emit("createRoom", roomData);
      localStorage.setItem("userId", generatedUserId);
      localStorage.setItem("pageAccessedByReload", `false`);
      setIsGameRoomLoading(false);

      navigate(`/game/${roomId}`, { replace: true });
    }
  };
  return (
    <>
      <button
        id="set_up_button"
        onClick={() => handleCreateNewRoom()}
        className={
          selectedThema.name.length > 1
            ? styles.set_up_button
            : styles.set_up_not_active_button
        }
      >
        <div className={styles.set_up_logo} />
        <strong>{isLoadingRoom ? "CREATING... " : "NEW ROOM"}</strong>
        <span className={styles.set_up_button_error_message}>
          You must select a theme
        </span>
      </button>
    </>
  );
};
export default SetUpGameThemaStartButton;
