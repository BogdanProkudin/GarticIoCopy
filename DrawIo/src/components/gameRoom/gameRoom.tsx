import { useEffect, useState } from "react";
import { socket } from "../../socket";
import { useAppDispatch, useAppSelector } from "../../store/hook";

import { useNavigate } from "react-router-dom";
import useGetRoomData from "../../hooks/useRoomInfo";
import styles from "./styles.module.scss";
import GameRoomHeader from "./gameRoomHeader";
import GameRoomUserList from "./gameRoomUsersList/gameRoomUserList";
import {
  setHost,
  setRoomUsers,
  setSelectedPlayers,
  setSelectedThema,
} from "../../store/slices/drawThema";
import Board from "../Board/Board";
import GameRoomAnswers from "./gameRoomInteractions/answers/gameRoomAnswers";
import GameRoomInteractions from "./gameRoomInteractions/gameRoomInteraction";

const GameRoom = () => {
  const userNameStorage = localStorage.getItem("userName");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentUrl = window.location.href;

  const path = currentUrl;
  const parts = path.split("/");
  const roomId = parts[parts.length - 1];
  const { roomData, isError, isLoading } = useGetRoomData(
    roomId,
    userNameStorage
  );
  useEffect(() => {
    if (isLoading) {
      console.log("Loading");
    }
  }, [isLoading]);

  useEffect(() => {
    if (!roomData) {
      console.log("ROOM IS OVER");
    }
  }, [roomData]);

  useEffect(() => {
    async function getRoomData() {
      socket.on("userJoined", (data: any) => {
        dispatch(setRoomUsers(data.usersInfo));
        console.log("user joined");
      });
      socket.on("userLeaved", (data: any) => {
        console.log("leavedData");
        dispatch(setRoomUsers(data?.usersInfo));
      });

      if (roomData) {
        dispatch(setSelectedThema(roomData.thema));
        dispatch(setRoomUsers(roomData?.usersInfo));
        dispatch(setSelectedPlayers(roomData.players));
        dispatch(setHost(roomData.host));
      }
    }
    getRoomData();
  }, [roomData]);

  useEffect(() => {
    socket.connect();
    socket.emit("joinRoom", roomId);
  }, []);

  return (
    <div className={styles.game_page_container}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,900;1,900&display=swap"
      />
      <div className={styles.game_room_container}>
        <GameRoomHeader />
        <div className={styles.game_room_content_container}>
          <GameRoomUserList />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Board roomId={roomId} />
            <GameRoomInteractions />
          </div>
        </div>
      </div>
    </div>
  );
};
export default GameRoom;
