import Lottie from "react-lottie";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import styles from "./styles.module.scss";
import LottieSettings from "../../tools/Animation - 1711477541401.json";
import { socket } from "../../socket";
import { setIsGameStarted, setIsRoundEnd } from "../../store/slices/roomInfo";
import { memo, useEffect } from "react";
import { handleGameStartButton } from "../../utils/handleStartGame";
import { setIsUserDraw } from "../../store/slices/userInfo";
import { useGetRoomIdFromUrl } from "../../hooks/useGetRoomIdFromUrl";

export const useGameSelectors = () => {
  return {
    activeIndex: useAppSelector((state) => state.drawThema.activeIndex),
    isGameStarted: useAppSelector((state) => state.drawThema.isGameStarted),
    roomUsers: useAppSelector((state) => state.drawThema.roomUsers),
    host: useAppSelector((state) => state.drawThema.host),
    selectedThema: useAppSelector((state) => state.drawThema.selectedThema),
  };
};

const BoardWait = () => {
  const dispatch = useAppDispatch();
  const roomId = useGetRoomIdFromUrl();
  const { activeIndex, roomUsers, host, selectedThema } = useGameSelectors();
  const userNameStorage = localStorage.getItem("userName");

  const maxGamePoints = useAppSelector(
    (state) => state.drawThema.maxRoomPoints
  );
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: LottieSettings,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  if (!roomUsers) {
    return <div>IN BOARD WAIT ZERO USERS</div>;
  }

  useEffect(() => {
    const onGameStarted = () => {
      dispatch(setIsUserDraw(true));
      dispatch(setIsRoundEnd(true));

      dispatch(setIsGameStarted(true));
    };

    socket.on("gameStarted", onGameStarted);

    return () => {
      socket.off("gameStarted", onGameStarted);
    };
  }, [dispatch]);

  const waitingTextStyles = {
    top:
      roomUsers.length > 1 && host.hostName !== userNameStorage ? "3rem" : "",
  };

  const animationContainerStyles = {
    top:
      roomUsers.length > 1 && host.hostName !== userNameStorage
        ? "5rem"
        : "2rem",
  };

  const waitingForOwnerTextStyles = {
    top:
      roomUsers.length > 1 && host.hostName !== userNameStorage
        ? "21.5rem"
        : "",
  };

  return (
    <div className={styles.board_wait_container}>
      <h1 className={styles.game_room_wait_text} style={waitingTextStyles}>
        WAITING
      </h1>
      <div
        className={styles.board_wait_animation}
        style={animationContainerStyles}
      >
        <Lottie
          options={defaultOptions}
          height={190}
          width={280}
          style={{ marginTop: "3.5rem" }}
          isClickToPauseDisabled
        />
      </div>
      {roomUsers.length <= 1 && (
        <span className={styles.game_room_wait_small_text}>
          Waiting for players
        </span>
      )}
      {roomUsers.length > 1 && host.hostName === userNameStorage && (
        <>
          <span className={styles.game_room_wait_small_text}>
            Players are waiting for you to start
          </span>
          <button
            data-testid={"button-id"}
            onClick={() =>
              handleGameStartButton({
                words: selectedThema.words,
                roomUsers,
                maxGamePoints,
                roomId,
                activeIndex,
                dispatch: dispatch,
              })
            }
            className={styles.game_room_start_button}
          >
            <div />
            <strong>PLAY!</strong>
          </button>
        </>
      )}
      {roomUsers.length > 1 && host.hostName !== userNameStorage && (
        <span
          className={styles.game_room_wait_small_text}
          style={waitingForOwnerTextStyles}
        >
          Waiting for the owner to start
        </span>
      )}
    </div>
  );
};

export default memo(BoardWait);
