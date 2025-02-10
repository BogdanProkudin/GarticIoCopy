import { useRef, useEffect } from "react";
import { animated, useSpring } from "react-spring";
import { useGetRoomIdFromUrl } from "../../../hooks/useGetRoomIdFromUrl";
import useVariousTimers from "../../../hooks/useVariousTimers";
import { socket } from "../../../socket";
import { useAppSelector, useAppDispatch } from "../../../store/hook";
import { setToolsPanel } from "../../../store/slices/drawInfo";
import { setIsRoundTimerOver } from "../../../store/slices/roomInfo";
import {
  setIsUsersNotGuessed,
  setIsUserDraw,
  setIsOneUserGuessed,
} from "../../../store/slices/userInfo";
import styles from "../styles.module.scss";

const RoundTimer = () => {
  const targetRef = useRef(null);
  const isUserDraw = useAppSelector((state) => state.userInfo.isUserDraw);
  const activeUser = useAppSelector((state) => state.drawThema.activeUser);
  const roomId = useGetRoomIdFromUrl();
  const roomUsers = useAppSelector((state) => state.drawThema.roomUsers);
  const activeIndex = useAppSelector((state) => state.drawThema.activeIndex);
  const userName = localStorage.getItem("userName");
  const dispatch = useAppDispatch();

  const { width } = useSpring({
    from: { width: "100%" },
    to: { width: `${0}%` },
    config: { duration: 50500 }, // Длительность анимации - 50 секунд
  });

  useVariousTimers({
    functionName: "RoundTimer",
    dispatch,
    userName,
    roomUsers,
    activeIndex,
    roomId,
    activeUser: activeUser.userName,
  });

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
    <div
      style={{ opacity: isUserDraw ? 0.2 : 1 }}
      className={`${styles.progress_round_line_container} ${styles.opacity_transition}`}
    >
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
