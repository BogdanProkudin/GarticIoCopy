import styles from "../styles.module.scss";
import Lottie from "react-lottie";
import LottieSettings from "../../../tools/Animation - 1712255326889.json";
import InactiveTimer from "../Timers/InactiveTimer";
import AllUserGuessed from "../Timers/AllUsersGuessedTimer";
import axios from "axios";
import { useEffect } from "react";
import { socket } from "../../../socket";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import {
  setChoosedWord,
  setIsIntervalOver,
  setIsRoundEnd,
  setIsRoundTimerOver,
  setRoundCount,
} from "../../../store/slices/roomInfo";
import {
  setIsAllUsersGuessed,
  setIsUserDraw,
  setIsOneUserGuessed,
  setIsUsersNotGuessed,
} from "../../../store/slices/userInfo";
import useVariousTimers from "../../../hooks/useVariousTimers";
import { useGetRoomIdFromUrl } from "../../../hooks/useGetRoomIdFromUrl";
const WordGuessSuccess = () => {
  const userNameStorage = localStorage.getItem("userName");
  const roomId = useGetRoomIdFromUrl();
  const activeUser = useAppSelector((state) => state.drawThema.activeUser);
  const dispatch = useAppDispatch();
  const defaultOptions = {
    loop: true,
    autoplay: true,

    animationData: LottieSettings,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useVariousTimers({
    functionName: "AllUsersGuessed",
    dispatch,
    roomId,

    userName: userNameStorage,
    activeUser: activeUser.userName,
  }); // starting timer

  useEffect(() => {
    const handleAllUsersGuessed = () => {
      dispatch(setChoosedWord(""));
      dispatch(setIsUserDraw(true));
      dispatch(setIsRoundEnd(true));
      dispatch(setIsOneUserGuessed(false));
      dispatch(setIsAllUsersGuessed(false));
      console.log("изменение ");

      dispatch(setIsUsersNotGuessed(false));
    };

    socket.on("getAllUsersGuessed", handleAllUsersGuessed);
    return () => {
      socket.off("getAllUsersGuessed", handleAllUsersGuessed);
    };
  }, [socket]);
  return (
    <div className={styles.container}>
      <div className={styles.white_background}>
        <div className={styles.your_turn_draw_container}>
          <h1>Success</h1>
          <div className={styles.success_animation}>
            <Lottie options={defaultOptions} isClickToPauseDisabled />
          </div>
          <span className={styles.game_room_inactive_small_text}>
            every body guessed correct
          </span>
          <AllUserGuessed time={47} />
        </div>
      </div>
    </div>
  );
};
export default WordGuessSuccess;
