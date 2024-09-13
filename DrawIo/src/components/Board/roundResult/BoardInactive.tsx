import styles from "../styles.module.scss";
import Lottie from "react-lottie";
import LottieSettings from "../../../tools/Animation - 1712053642285.json";

import InactiveTimer from "../Timers/InactiveTimer";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { useEffect } from "react";
import { socket } from "../../../socket";
import axios from "axios";
import {
  setIsIntervalOver,
  setIsRoundEnd,
  setIsRoundTimerOver,
} from "../../../store/slices/roomInfo";
import { setIsUsersNotGuessed } from "../../../store/slices/userInfo";
import { useGetRoomIdFromUrl } from "../../../hooks/useGetRoomIdFromUrl";

const BoardInactive = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: LottieSettings,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const dispatch = useAppDispatch();
  // useEffect(() => {
  //   if (userNameStorage === activeUser.userName) {
  //     const foundActiveUser = roomUsers.find(
  //       (el: { userName: any }) => el.userName === activeUser.userName
  //     );

  //     if (foundActiveUser) {
  //       const activeUserIndex = roomUsers.indexOf(foundActiveUser);

  //       // socket.emit("answersSent", {
  //       //   userName: roomUsers[activeUserIndex].userName,

  //       //   message: `${roomUsers[activeUserIndex].userName} lost turn :()`,
  //       //   roomId: roomId,
  //       // });
  //     }
  //   }
  // }, []);

  // useEffect(() => {
  //   const sendInactiveOver = async (url: string) => {
  //     try {
  //       await axios.post(url, {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         roomId,
  //       });

  //       // socket.emit("inactiveOver", roomId);
  //     } catch (error) {
  //       console.error("Error:", error);
  //     }
  //   };
  //   const url = "http://localhost:3000/inactiveTimer";

  //   sendInactiveOver(url);
  // }, []);
  useEffect(() => {
    const handleInactiveOver = () => {
      dispatch(setIsRoundEnd(true));
      dispatch(setIsIntervalOver(false));
      dispatch(setIsUsersNotGuessed(false));
    };

    socket.on("getInactiveOver", handleInactiveOver);
    return () => {
      socket.off("getInactiveOver", handleInactiveOver);
    };
  }, [socket]);

  return (
    <div className={styles.your_turn_draw_container}>
      <h1>Inactive</h1>
      <div className={styles.game_room_inactive_timer_animation}>
        <Lottie options={defaultOptions} isClickToPauseDisabled />
      </div>
      <span className={styles.game_room_inactive_small_text}>
        The user did not select a word
      </span>
      <InactiveTimer time={60} />
    </div>
  );
};

export default BoardInactive;
