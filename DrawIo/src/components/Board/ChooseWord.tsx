import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import LottieSettings from "../../tools/Animation - 1711653829862.json";
import Lottie from "react-lottie";
import styles from "./styles.module.scss";
import { socket } from "../../socket";
import {
  setChoosedWord,
  setIsGameStarted,
  setIsRoundEnd,
  setIsUserDraw,
} from "../../store/slices/drawThema";
import { useAppDispatch, useAppSelector } from "../../store/hook";

import ProgressBar from "./Timers/IntervalTimer";
import VariantWord from "./VariantWord";
import WaitTurn from "./WaitTurn";
import BoardInactive from "./roundResult/BoardInactive";
const ChooseWord = () => {
  const [chosenWords, setChosenWords] = useState([]);
  const [guess, setGuess] = useState("");
  const currentUrl = window.location.href;

  const path = currentUrl;
  const parts = path.split("/");
  const roomId = parts[parts.length - 1];
  const activeIndex = useAppSelector((state) => state.drawThema.activeIndex);
  const isUserDraw = useAppSelector((state) => state.drawThema.isUserDraw);
  const roomUsers = useAppSelector((state) => state.drawThema.roomUsers);
  const choosedWord = useAppSelector((state) => state.drawThema.choosedWord);
  const [correctGuess, setCorrectGuess] = useState(null);
  const activeUser = useAppSelector((state) => state.drawThema.activeUser);
  const isRoundEnd = useAppSelector((state) => state.drawThema.isRoundEnd);
  const userName = localStorage.getItem("userName");
  const dispatch = useAppDispatch();
  const handleChooseDrawWord = (choosedWord: string) => {
    socket.emit("wordChoosed", { choosedWord, roomId });
  };
  const defaultOptions = {
    loop: true,
    autoplay: true,

    animationData: LottieSettings,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    socket.on("getWordChoosed", (data) => {
      dispatch(setChoosedWord(data));
      dispatch(setIsGameStarted(true));
    });
    socket.on("gameWords", (words) => {
      setChosenWords(words);
    });

    return () => {
      socket.off("gameWords");
    };
  }, [socket]);
  console.log(isRoundEnd, "round");

  return (
    <div className={styles.container}>
      {activeUser.userName === userName && isRoundEnd ? (
        <div className={styles.your_turn_draw_container}>
          <h1>Its your Turn</h1>
          <span>Choose a word to Draw</span>
          <Lottie
            options={defaultOptions}
            style={{ height: "150px", width: "150px" }}
          />
          <h2
            style={{
              position: "relative",
              left: "0.5rem",
              bottom: "2rem",
              color: "grey",
            }}
          >
            or
          </h2>
          <div
            style={{
              borderRight: "1px solid grey",
              height: "40px",
              position: "absolute",
              top: "18rem",
              right: "20.5rem",
            }}
          />
          <div className={styles.suggestion_variants_container}>
            {chosenWords.map((word) => {
              return (
                <div
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
  );
};

export default ChooseWord;
