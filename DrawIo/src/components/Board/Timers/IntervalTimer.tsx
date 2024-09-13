import { useEffect, useRef, useState } from "react";
import { useSpring, animated } from "react-spring";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { socket } from "../../../socket";
import {
  setIsIntervalOver,
  setIsRoundEnd,
} from "../../../store/slices/roomInfo";
import styles from "../styles.module.scss";
import axios from "axios";
import useVariousTimers from "../../../hooks/useVariousTimers";
import { useGetRoomIdFromUrl } from "../../../hooks/useGetRoomIdFromUrl";

const IntervalTimer = () => {
  const targetRef = useRef(null);
  const activeUser = useAppSelector((state) => state.drawThema.activeUser);
  const isIntervalOver = useAppSelector(
    (state) => state.drawThema.isIntervalOver
  );
  const roomUsers = useAppSelector((state) => state.drawThema.roomUsers);
  const roomId = useGetRoomIdFromUrl();

  const activeIndex = useAppSelector((state) => state.drawThema.activeIndex);
  const userName = localStorage.getItem("userName");
  const dispatch = useAppDispatch();
  const { x } = useSpring({
    from: { x: 100 },
    to: { x: 0 },
    config: { duration: 10100 },
  });
  const isRoundEnd = useAppSelector((state) => state.drawThema.isRoundEnd);
  const animate = () => {
    const start = performance.now();

    const update = () => {
      const now = performance.now();
      const progress = (now - start) / 10100; // Calculate progress

      if (progress <= 1) {
        x.set(100 - 100 * progress); // Update progress from 100 to 0
        requestAnimationFrame(update);
      } else {
        if (activeUser.userName === userName) {
        }
      }
    };
    requestAnimationFrame(update);
  };

  useEffect(() => {
    animate();
  }, []);
  useVariousTimers({
    functionName: "IntervalTimer",
    dispatch,
    isRoundEnd,
    userName,
    roomUsers,
    activeIndex,
    roomId,
    activeUser: activeUser.userName,
  }); // starting timer

  useEffect(() => {
    const handleSkipRound = () => {
      dispatch(setIsRoundEnd(false));
    };

    socket.on("getSkipRound", handleSkipRound);
    return () => {
      socket.off("getSkipRound", handleSkipRound);
    };
  }, [socket]);
  return (
    <div className={styles.progressBarContainer}>
      <animated.div
        className={styles.progress_bar_lines}
        ref={targetRef}
        style={{
          width: x.to((val) => `${val}%`),

          height: "10px",
        }}
      />
    </div>
  );
};

export default IntervalTimer;
