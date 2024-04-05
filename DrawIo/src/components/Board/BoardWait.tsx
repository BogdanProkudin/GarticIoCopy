import Lottie from "react-lottie";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import styles from "./styles.module.scss";
import LottieSettings from "../../tools/Animation - 1711477541401.json";
import { socket } from "../../socket";
import {
  setIsGameStarted,
  setIsRoundEnd,
  setIsUserDraw,
} from "../../store/slices/drawThema";
import { useEffect } from "react";

const BoardWait = () => {
  const dispatch = useAppDispatch();

  const currentUrl = window.location.href;

  const path = currentUrl;
  const parts = path.split("/");
  const roomId = parts[parts.length - 1];
  const activeIndex = useAppSelector((state) => state.drawThema.activeIndex);
  const defaultOptions = {
    loop: true,
    autoplay: true,

    animationData: LottieSettings,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const roomUsers = useAppSelector((state) => state.drawThema.roomUsers);
  const host = useAppSelector((state) => state.drawThema.host);
  const selectedThema = useAppSelector(
    (state) => state.drawThema.selectedThema
  );

  const userNameStorage = localStorage.getItem("userName");
  const handleGameStartButton = () => {
    console.log("game button clicked");

    socket.emit("nextUserCall", {
      users: roomUsers,
      index: activeIndex,
      roomId,
    });
    socket.emit("startGame", { words: selectedThema.words, roomId });
  };
  useEffect(() => {
    socket.on("gameStarted", () => {
      dispatch(setIsUserDraw(true));
      dispatch(setIsRoundEnd(true));
      dispatch(setIsGameStarted(true));
    });
  }, []);
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <h1
        style={{
          top: roomUsers.length > 1 && host !== userNameStorage ? "3rem" : "",
        }}
        className={styles.game_room_wait_text}
      >
        WAITING
      </h1>
      <Lottie
        style={{
          position: "absolute",
          height: "300px",
          width: "300px",
          top:
            roomUsers.length > 1 && host !== userNameStorage ? "5rem" : "2rem",
          left: "11.7rem",
        }}
        options={defaultOptions}
        isClickToPauseDisabled
      />
      {roomUsers.length <= 1 && (
        <span className={styles.game_room_wait_small_text}>
          Waiting for players
        </span>
      )}
      {roomUsers.length > 1 && host === userNameStorage && (
        <>
          <span className={styles.game_room_wait_small_text}>
            Players are waiting for you to start
          </span>
          <button
            onClick={() => handleGameStartButton()}
            style={{ position: "absolute", top: "20rem" }}
            className={styles.game_room_start_button}
          >
            <div />
            <strong>PLAY!</strong>
          </button>
        </>
      )}
      {roomUsers.length > 1 && host !== userNameStorage && (
        <span
          style={{
            top:
              roomUsers.length > 1 && host !== userNameStorage ? "21.5rem" : "",
          }}
          className={styles.game_room_wait_small_text}
        >
          Waiting for the owner to start
        </span>
      )}
    </div>
  );
};
export default BoardWait;
