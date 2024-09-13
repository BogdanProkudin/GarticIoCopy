import styles from "../styles.module.scss";
import Lottie from "react-lottie";
import LottieSettings from "../../../tools/Animation - 1721731239797.json";
import InactiveTimer from "../Timers/InactiveTimer";
import { useEffect } from "react";
import { socket } from "../../../socket";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import axios from "axios";
import {
  setChoosedWord,
  setIsIntervalOver,
  setIsRoundTimerOver,
  setRoundCount,
} from "../../../store/slices/roomInfo";
import {
  setIsUsersNotGuessedStarted,
  setIsUsersNotGuessed,
} from "../../../store/slices/userInfo";
import useVariousTimers from "../../../hooks/useVariousTimers";
import { useGetRoomIdFromUrl } from "../../../hooks/useGetRoomIdFromUrl";

const UsersNotGuessed = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,

    animationData: LottieSettings,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const roomId = useGetRoomIdFromUrl();
  const userNameStorage = localStorage.getItem("userName");

  const activeUser = useAppSelector((state) => state.drawThema.activeUser);
  const isUsersNotGuessed = useAppSelector(
    (state) => state.userInfo.isUsersNotGuessed
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setIsUsersNotGuessedStarted(true));
  }, []);
  // useEffect(() => {
  //   if (userNameStorage === activeUser.userName) {
  //     socket.emit("answersSent", {
  //       message: `the answer was`,
  //       roomId: roomId,
  //     });
  //     socket.emit("answersSent", {
  //       message: "interval@@",
  //       roomId: roomId,
  //     });
  //   }
  // }, []);

  useVariousTimers({
    functionName: "UsersNotGuessed",
    dispatch,
    roomId,

    isUsersNotGuessed: isUsersNotGuessed,
    userName: userNameStorage,
    activeUser: activeUser.userName,
  }); // starting timer

  useEffect(() => {
    const handleUsersNotGuessed = () => {
      dispatch(setChoosedWord(""));
      dispatch(setIsUsersNotGuessed(false));
      dispatch(setIsUsersNotGuessedStarted(false));
    };

    socket.on("getUsersNotGuessedTimer", handleUsersNotGuessed);
    return () => {
      socket.off("getUsersNotGuessedTimer", handleUsersNotGuessed);
    };
  }, [socket]);
  return (
    <div className={styles.container}>
      <div className={styles.white_background}>
        <div className={styles.not_guessed_container}>
          <h1>Not guessed</h1>
          <div className={styles.not_guessed_animation}>
            <Lottie options={defaultOptions} isClickToPauseDisabled />
          </div>
          <span className={styles.not_guessed_small_text}>
            someone guessed wrong
          </span>
          <InactiveTimer time={47} />
        </div>
      </div>
    </div>
  );
};

export default UsersNotGuessed;
