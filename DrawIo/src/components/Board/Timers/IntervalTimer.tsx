import React, { useEffect, useState } from "react";
import { useSpring, animated } from "react-spring";
import styles from "../styles.module.scss";
import { socket } from "../../../socket";
import {
  setIsUserDraw,
  setChoosedWord,
  setIsRoundEnd,
} from "../../../store/slices/drawThema";
import { useAppDispatch, useAppSelector } from "../../../store/hook";

const IntervalTimer = () => {
  const dispatch = useAppDispatch();
  const activeIndex = useAppSelector((state) => state.drawThema.activeIndex);
  const currentUrl = window.location.href;
  const path = currentUrl;
  const parts = path.split("/");
  const roomId = parts[parts.length - 1];
  const userNameLocalStorage = localStorage.getItem("userName");
  const isRoundEnd = useAppSelector((state) => state.drawThema.isRoundEnd);
  const [isRender, setIsRender] = useState(false);
  const activeUser = useAppSelector((state) => state.drawThema.activeUser);
  const roomUsers = useAppSelector((state) => state.drawThema.roomUsers);
  const choosedWord = useAppSelector((state) => state.drawThema.choosedWord);
  const selectedThema = useAppSelector(
    (state) => state.drawThema.selectedThema
  );
  const handleSkipRound = () => {};
  const [completed, setCompleted] = useState<any>(100);
  const [isFinished, setIsFinished] = useState(false);
  useEffect(() => {
    if (completed === 0) {
      if (activeUser.userName === userNameLocalStorage) {
        socket.emit("skipRound", { roomId });
      }
    }
  }, [completed]);
  const { width } = useSpring({
    from: { width: "100%" },
    to: { width: `${completed}%` },
    config: { duration: 140 }, // Уменьшаем длительность анимации
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCompleted((prev: any) => (prev > 0 ? prev - 1 : prev));
    }, 140); // Уменьшаем интервал для более плавной анимации

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    socket.on("getSkipRound", (data) => {
      dispatch(setIsRoundEnd(false));

      socket.emit("nextUserCall", {
        roomId,
        users: roomUsers,
        index: activeIndex,
      });

      setTimeout(() => {
        console.log("here");
        socket.emit("startGame", { words: selectedThema.words, roomId });
        dispatch(setIsRoundEnd(true));
      }, 6100);
    });
  }, []);
  return (
    <div className={styles.progressBarContainer}>
      <animated.div
        className={styles.progress_bar_lines}
        style={{ width, height: "10px" }}
      />
    </div>
  );
};

export default IntervalTimer;
