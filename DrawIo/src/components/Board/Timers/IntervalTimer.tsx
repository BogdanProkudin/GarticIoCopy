import { useEffect, useRef } from "react";
import styles from "../styles.module.scss";
import useVariousTimers from "../../../hooks/useVariousTimers";
import { socket } from "../../../socket";
import { setIsRoundEnd } from "../../../store/slices/roomInfo";
import { useGetRoomIdFromUrl } from "../../../hooks/useGetRoomIdFromUrl";
import { useAppSelector, useAppDispatch } from "../../../store/hook";
const IntervalTimer = () => {
  const boxRef = useRef<any>(null);
  const activeUser = useAppSelector((state) => state.drawThema.activeUser);

  const roomUsers = useAppSelector((state) => state.drawThema.roomUsers);
  const roomId = useGetRoomIdFromUrl();

  const activeIndex = useAppSelector((state) => state.drawThema.activeIndex);
  const userName = localStorage.getItem("userName");
  const dispatch = useAppDispatch();
  const isRoundEnd = useAppSelector((state) => state.drawThema.isRoundEnd);
  useEffect(() => {
    const box = boxRef.current;
    let startTime: any = null;

    const animate = (timestamp: any) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const duration = 10000; // 7 секунд

      if (progress < duration) {
        const scale = 1 - progress / duration; // Уменьшаем масштаб по X
        box.style.transform = `scaleX(${scale})`;
        requestAnimationFrame(animate);
      } else {
        console.log("закончилось анимация");

        box.style.transform = "scaleX(0)"; // Завершаем анимацию
      }
    };

    requestAnimationFrame(animate);
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
      <div
        ref={boxRef}
        style={{
          width: "100%",
          borderBottomLeftRadius: "10px",
          borderTopLeftRadius: "10px",
          height: "10px",
          backgroundColor: "goldenrod",
          transformOrigin: "left", // Точка отсчета для трансформации
        }}
      ></div>
    </div>
  );
};

export default IntervalTimer;