import { useEffect, memo } from "react";

import LottieSettings from "../../tools/Animation - 1711653829862.json";
import Lottie from "react-lottie";
import styles from "./styles.module.scss";
import { socket } from "../../socket";
import {
  setChoosedWord,
  setChoosedWordsList,
  setChosenWords,
  setIsGameStarted,
  setIsRoundTimerOver,
  setRoundCount,
} from "../../store/slices/roomInfo";

import { useAppDispatch, useAppSelector } from "../../store/hook";

import ProgressBar from "./Timers/IntervalTimer";
import VariantWord from "./VariantWord";
import WaitTurn from "./WaitTurn";
import BoardInactive from "./roundResult/BoardInactive";
import { setIsUserDraw } from "../../store/slices/userInfo";
import { setToolsPanel } from "../../store/slices/drawInfo";
import axios from "axios";
import { useGetRoomIdFromUrl } from "../../hooks/useGetRoomIdFromUrl";

const ChooseWord = memo(function ChooseWord() {
  const roomId = useGetRoomIdFromUrl();

  const { activeUser, choosedWordsList, chosenWords, isRoundEnd } =
    useAppSelector((state) => ({
      activeUser: state.drawThema.activeUser,
      chosenWords: state.drawThema.chosenWords,
      isRoundEnd: state.drawThema.isRoundEnd,
      choosedWordsList: state.drawThema.choosedWordsList,
    }));
  const userName = localStorage.getItem("userName");
  const dispatch = useAppDispatch();
  const handleChooseDrawWord = (choosedWord: string) => {
    const sendWordChoosed = async (url: string) => {
      try {
        const response = await axios.post(url, {
          headers: {
            "Content-Type": "application/json",
          },

          roomId,
        });
        if (response.data) {
          socket.emit("wordChoosed", { choosedWord, roomId });
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    const url = "http://localhost:3000/wordChoosed";

    sendWordChoosed(url);
  };
  const defaultOptions = {
    loop: true,
    autoplay: true,

    animationData: LottieSettings,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  // useEffect(() => {
  //   const getWhoIsNext = async () => {
  //     const foundActiveUser = await roomUsers.find(
  //       (el: { userName: any }) => el.userName === activeUser.userName
  //     );
  //     if (foundActiveUser) {
  //       const activeUserIndex = await roomUsers.indexOf(foundActiveUser);

  //       if (userName === roomUsers[activeUserIndex].userName) {
  //         setTimeout(() => {}, 1000);
  //       }
  //     }
  //   };
  //   getWhoIsNext();
  // }, [roomUsers]);

  useEffect(() => {
    socket.on("getWordChoosed", (data: any) => {
      dispatch(setChoosedWord(data));
      dispatch(setToolsPanel(true));
      dispatch(setRoundCount());
      dispatch(setChoosedWordsList([...choosedWordsList, data]));
      dispatch(setIsUserDraw(false));

      dispatch(setIsGameStarted(true));
    });
    socket.on("gameWords", async (words) => {
      dispatch(setChosenWords(words));
    });

    return () => {
      socket.off("gameWords");
      socket.off("getWord");
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.white_background}>
        {activeUser.userName === userName && isRoundEnd ? (
          <div className={styles.your_turn_draw_container}>
            <h1>Its your Turn</h1>
            <span>Choose a word to Draw</span>
            <div className={styles.choose_word_animation}>
              <Lottie options={defaultOptions} />
            </div>
            <h2 className={styles.or_text}>or</h2>
            <div className={styles.board_choose_word_container} />
            <div className={styles.suggestion_variants_container}>
              {chosenWords.map((word) => {
                return (
                  <div
                    key={word}
                    onClick={() => handleChooseDrawWord(word)}
                    className={styles.suggestion_word_container}
                  >
                    <VariantWord word={word} />
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: "0.6rem" }}>
              <ProgressBar />
            </div>
          </div>
        ) : isRoundEnd ? (
          <WaitTurn />
        ) : (
          <BoardInactive />
        )}
      </div>
    </div>
  );
});

export default ChooseWord;
