import React, { useEffect, useState, memo } from "react";
import { socket } from "../../socket";
import styles from "./styles.module.scss";
import { useAppDispatch, useAppSelector } from "../../store/hook";

import BoardContent from "./BoardContent";
import useMousePosition from "./DrawSettings/ToolsPicker/EraserPosition";
import { handleNextUserCall } from "../../hooks/getActiveUser";
import RoundTimer from "./Timers/RoundTimer";

import { useDrawing } from "../../hooks/useDrawing";

import {
  setHost,
  setISActiveUserLeaved,
  setIsDeletingRoom,
  setIsRoundTimerOver,
  setRoomUsers,
} from "../../store/slices/roomInfo";
import { setToolsPanel } from "../../store/slices/drawInfo";
import {
  setIsUserDraw,
  setIsOneUserGuessed,
} from "../../store/slices/userInfo";

type BoardProps = {
  roomId: string;
  contextRef: React.RefObject<any>;
  drawRef: React.RefObject<any>;
};

// interface User {
//   id: string;
//   userName: string;
//   isActive: boolean;
//   userPoints: number;
// }

// interface UserData {
//   users: User[];
// }

const Board: React.FC<BoardProps> = ({ contextRef, drawRef }) => {
  const userNameLocalStorage = localStorage.getItem("userName");
  const [isGuessedAnimationFinished, setIsGuessedAnimationFinished] =
    useState(false);
  const mousePosition = useMousePosition();

  const activeUser = useAppSelector((state) => state.drawThema.activeUser);
  const dispatch = useAppDispatch();
  const roundCount = useAppSelector((state) => state.drawThema.roundCount);
  const activeTool = useAppSelector((state) => state.drawInfo.activeTool);
  const roomUsers = useAppSelector((state) => state.drawThema.roomUsers);

  useEffect(() => {
    // Обработчик события getUserLeft
    const handleUserLeft = (data: {
      roomId: string;
      userName: string;
      roomUsers: any[];
      host: { userName: string; userId: string };
    }) => {
      console.log("User left:", data.userName, data.roomUsers, data.host);
      dispatch(setRoomUsers(data.roomUsers));
      dispatch(
        setHost({ hostName: data.host.userName, hostId: data.host.userId })
      );
    };
    const handleOneUserRemaining = (data: any) => {
      console.log("вы остались один", data.message);
      dispatch(setIsDeletingRoom(true));
    };

    socket.on("getUserLeft", handleUserLeft);
    socket.on("getRoomDeletedWarning", handleOneUserRemaining);
    return () => {
      socket.off("getUserLeft", handleUserLeft);
      socket.off("getRoomDeletedWarning", handleOneUserRemaining);
    };
  }, []);
  useEffect(() => {
    const handleActiveUserLeaved = () => {
      dispatch(setISActiveUserLeaved(true));
      dispatch(setToolsPanel(false));
      dispatch(setIsUserDraw(false));
      dispatch(setIsRoundTimerOver(false));
      dispatch(setIsOneUserGuessed(false));
    };
    socket.on("getActiveUserLeaved", handleActiveUserLeaved);
    return () => {
      socket.off("getActiveUserLeaved", handleActiveUserLeaved);
    };
  }, []);
  const isAllUsersGuessed = useAppSelector(
    (state) => state.userInfo.isAllUsersGuessed
  );
  const toolsPanel = useAppSelector((state) => state.drawInfo.toolsPanel);
  const isGameStarted = useAppSelector(
    (state) => state.drawThema.isGameStarted
  );
  const maxGamePoints = useAppSelector(
    (state) => state.drawThema.maxRoomPoints
  );

  useEffect(() => {
    socket.on("getNextUserCall", async (data) => {
      const awaitedData = await data;

      handleNextUserCall({
        dispatch,
        roundCount,
        setIsGuessedAnimationFinished,
        roomUsers,
        maxGamePoints,
        users: awaitedData.users,
        activeUser: awaitedData.activeUser,
      });
    });

    return () => {
      socket.off("getNextUserCall", handleNextUserCall);
    };
  }, []);

  useEffect(() => {});

  const { handleDrawing } = useDrawing({
    activeUser,
    drawRef,
    contextRef,

    userNameLocalStorage,
  });

  useEffect(() => {
    socket.on("getDraw", handleDrawing);
    return () => {
      socket.off("getDraw", handleDrawing);
    };
  }, [handleDrawing]);

  return (
    <>
      {activeTool === "eraser" && (
        <div
          className={styles.eraser_square}
          style={{
            left: mousePosition.x - 25,
            top: mousePosition.y + 40,
          }}
        ></div>
      )}

      <BoardContent
        isGuessedAnimationFinished={isGuessedAnimationFinished}
        setIsGuessedAnimationFinished={setIsGuessedAnimationFinished}
      />
      {isGameStarted && toolsPanel && !isAllUsersGuessed && <RoundTimer />}
    </>
  );
};

export default memo(Board);
