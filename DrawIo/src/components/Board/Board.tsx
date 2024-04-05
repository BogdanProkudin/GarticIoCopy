import React, { useEffect, useRef, useState, useMemo } from "react";
import Lottie from "react-lottie";

import { socket } from "../../socket";
import styles from "./styles.module.scss";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import {
  setActiveIndex,
  setActiveUser,
  setRoomUsers,
} from "../../store/slices/drawThema";
import BoardWait from "./BoardWait";
import GameRoom123 from "./ChooseWord";
import ChooseWord from "./ChooseWord";
import LottieSettings from "../../tools/Animation - 1712170538790.json";
import WordGuessSuccess from "./roundResult/WordGuessSuccess";
type BoardProps = {
  roomId: string;
};

const Board: React.FC<BoardProps> = ({ roomId }) => {
  const canvasRef = useRef(null);
  let contextRef = useRef<any>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const roomUsers = useAppSelector((state) => state.drawThema.roomUsers);
  const activeUser = useAppSelector((state) => state.drawThema.activeUser);
  const isAllUsersGuessed = useAppSelector(
    (state) => state.drawThema.isAllUsersGuessed
  );
  const [isGuessedAnimationFinished, setIsGuessedAnimationFinished] =
    useState(false);

  const choosedWord = useAppSelector((state) => state.drawThema.choosedWord);
  const isOneUserGuessed = useAppSelector(
    (state) => state.drawThema.isOneUserGuessed
  );
  const dispatch = useAppDispatch();
  const userNameStorage = localStorage.getItem("userName");
  const isGameStarted = useAppSelector(
    (state) => state.drawThema.isGameStarted
  );
  const defaultLottieOptions = {
    loop: false,
    autoplay: true,

    animationData: LottieSettings,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const handleAnimationComplete = () => {
    setIsGuessedAnimationFinished(true);
  };
  useEffect(() => {
    const handleNextUserCall = (data: any) => {
      if (data && data.users && data.users.length > 0) {
        if (canvasRef.current) {
          const canvas: any = canvasRef.current;
          contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
        }
        // Ищем первого активного пользователя
        const firstActive = data.users.find((user: any) => user.isActive);

        if (!firstActive) {
          // Если активного пользователя нет, делаем первого пользователя активным
          const updatedUsers = data.users.map((user: any, index: number) => ({
            ...user,
            isActive: index === 0,
          }));

          dispatch(setRoomUsers(updatedUsers));
          dispatch(setActiveUser(updatedUsers[0]));
        } else {
          // Ищем индекс активного пользователя
          const activeUserIndex = data.users.findIndex(
            (user: any) => user.isActive
          );
          // Определяем индекс следующего пользователя
          const nextUserIndex =
            activeUserIndex === data.users.length - 1 ? 0 : activeUserIndex + 1;
          // Обновляем массив пользователей, делая активным следующего пользователя
          const updatedUsers = data.users.map((user: any, index: number) => ({
            ...user,
            isActive: index === nextUserIndex,
          }));

          dispatch(setRoomUsers(updatedUsers));
          dispatch(setActiveUser(updatedUsers[nextUserIndex]));
        }
      } else {
        console.log("No users data received from socket.");
      }
    };

    socket.on("getNextUserCall", handleNextUserCall);

    return () => {
      socket.off("getNextUserCall", handleNextUserCall);
    };
  }, []);

  const handleDrawing = ({ type, x, y, userName }: any) => {
    switch (type) {
      case "start":
        contextRef.current.beginPath();
        contextRef.current.moveTo(x, y);
        break;
      case "draw":
        contextRef.current.lineTo(x, y);
        contextRef.current.stroke();
        console.log("draw", userNameStorage);

        break;
      case "end":
        contextRef.current.closePath();
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    socket.on("getDraw", handleDrawing);

    return () => {
      socket.off("getDraw");
    };
  }, []);

  useEffect(() => {
    const canvas: any = canvasRef.current;

    canvas.width = 1300;
    canvas.height = 800;
    canvas.style.width = `${650}px`;
    canvas.style.height = `${400}px`;
    const context = canvas.getContext("2d");
    context.scale(2, 2);
    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = 4;
    contextRef.current = context;
  }, []);
  // Функция для инициализации рисования
  const startDrawing = ({ nativeEvent }: any) => {
    const { offsetX, offsetY } = nativeEvent;

    setIsDrawing(true);
    if (activeUser && activeUser.userName === userNameStorage) {
      socket.emit("drawing", {
        type: "start",
        x: offsetX,
        y: offsetY,
        roomId,
        userName: "123",
      });
    }
  };

  // Функция для рисования
  const draw = ({ nativeEvent }: any) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;

    if (activeUser && activeUser.userName === userNameStorage) {
      socket.emit("drawing", { type: "draw", x: offsetX, y: offsetY, roomId });
    }
  };

  // Функция для завершения рисования
  const endDrawing = () => {
    setIsDrawing(false);
    if (activeUser && activeUser.userName === userNameStorage) {
      socket.emit("drawing", { type: "end", roomId });
    }
  };

  return (
    <>
      {!isGameStarted ? (
        <BoardWait />
      ) : choosedWord.length < 1 ? (
        <ChooseWord />
      ) : activeUser.userName === userNameStorage ? (
        ""
      ) : (
        ""
      )}
      {isAllUsersGuessed && <WordGuessSuccess />}
      {isOneUserGuessed &&
        !isGuessedAnimationFinished &&
        roomUsers.length > 2 && (
          <div style={{ position: "absolute", zIndex: 2 }}>
            <div style={{ position: "relative", left: "15rem", top: "7rem" }}>
              <Lottie
                options={defaultLottieOptions}
                isClickToPauseDisabled
                style={{
                  width: "200px",
                  height: "200px",
                  position: "absolute",
                }}
                eventListeners={[
                  {
                    eventName: "complete",
                    callback: handleAnimationComplete,
                  },
                ]}
              />
            </div>
          </div>
        )}

      <canvas
        ref={canvasRef}
        style={{
          border: "1px solid black",
          marginTop: "1rem",
          backgroundColor: "white",
          marginLeft: "1rem",
          borderRadius: "10px",
        }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
      />
    </>
  );
};

export default Board;
