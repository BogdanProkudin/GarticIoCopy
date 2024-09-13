import { useEffect, useRef, useState } from "react";
import { useSpring, animated } from "react-spring";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { socket } from "../../../socket";
import {
  setIsRoundTimerOver,
  setRoundCount,
} from "../../../store/slices/roomInfo";
import styles from "../styles.module.scss";
import axios from "axios";
import { setToolsPanel } from "../../../store/slices/drawInfo";
import {
  setIsUsersNotGuessed,
  setIsUserDraw,
  setIsOneUserGuessed,
} from "../../../store/slices/userInfo";
import useVariousTimers from "../../../hooks/useVariousTimers";
import { useGetRoomIdFromUrl } from "../../../hooks/useGetRoomIdFromUrl";
const RoundTimer = () => {
  const targetRef = useRef(null);

  const activeUser = useAppSelector((state) => state.drawThema.activeUser);
  const roomId = useGetRoomIdFromUrl();
  const roomUsers = useAppSelector((state) => state.drawThema.roomUsers);
  const activeIndex = useAppSelector((state) => state.drawThema.activeIndex);
  const userName = localStorage.getItem("userName");
  const dispatch = useAppDispatch();
  const [completed, setCompleted] = useState<any>(100);
  const isRoundTimerOver = useAppSelector(
    (state) => state.drawThema.isRoundTimerOver
  );
  const isAllUsersGuessed = useAppSelector(
    (state) => state.userInfo.isAllUsersGuessed
  );
  const { width } = useSpring({
    from: { width: "100%" },
    to: { width: `${completed}%` },
    config: { duration: 500 }, // Уменьшаем длительность анимации
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCompleted((prev: any) => (prev > 0 ? prev - 1 : prev));
    }, 200); // Уменьшаем интервал для более плавной анимации

    return () => clearInterval(interval);
  }, []);
  useVariousTimers({
    functionName: "RoundTimer",
    dispatch,

    userName,
    roomUsers,
    activeIndex,
    roomId,
    activeUser: activeUser.userName,
  }); // starting timer

  // useEffect(() => {
  //   if (isRoundTimerOver && activeUser.userName === userName) {
  //   }
  // }, [isRoundTimerOver]);
  useEffect(() => {
    const handleSkipRound = () => {
      dispatch(setIsUsersNotGuessed(true));
      dispatch(setToolsPanel(false));
      dispatch(setIsUserDraw(false));
      dispatch(setIsRoundTimerOver(false));
      dispatch(setIsOneUserGuessed(false));
    };

    socket.on("getSkipRound", handleSkipRound);
    return () => {
      socket.off("getSkipRound", handleSkipRound);
    };
  }, [dispatch]);

  return (
    <div className={styles.progress_round_line_container}>
      <animated.div
        className={styles.progress_bar_lines}
        ref={targetRef}
        style={{
          width: width,
        }}
      />
    </div>
  );
};

export default RoundTimer;
