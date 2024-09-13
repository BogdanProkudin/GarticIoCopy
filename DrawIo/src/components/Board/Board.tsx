import React, { useEffect, useState, useCallback, memo } from "react";
import { socket } from "../../socket";
import styles from "./styles.module.scss";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { useNavigate } from "react-router-dom";
import BoardContent from "./BoardContent";
import useMousePosition from "./DrawSettings/ToolsPicker/EraserPosition";
import { handleNextUserCall } from "../../hooks/getActiveUser";
import RoundTimer from "./Timers/RoundTimer";
import { logDOM } from "@testing-library/react";
import { useDrawing } from "../../hooks/useDrawing";
import axios from "axios";
import { useGetRoomIdFromUrl } from "../../hooks/useGetRoomIdFromUrl";

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
  const roomId = useGetRoomIdFromUrl();
  const userNameStorage = localStorage.getItem("userName");
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
    console.log("slibidirizz");

    socket.on("getNextUserCall", (data) => {
      handleNextUserCall({
        dispatch,
        roundCount,
        setIsGuessedAnimationFinished,
        roomUsers,
        maxGamePoints,
        data,
      });
    });

    return () => {
      socket.off("getNextUserCall", handleNextUserCall);
    };
  }, []);

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
