import { memo } from "react";
import LottieSettings from "../../tools/Animation - 1711653829862.json";
import Lottie from "react-lottie";
import styles from "./styles.module.scss";
import { useAppSelector } from "../../store/hook";
import ProgressBar from "./Timers/IntervalTimer";
import VariantWord from "./VariantWord";
import WaitTurn from "./WaitTurn";
import BoardInactive from "./roundResult/BoardInactive";
import { useGetRoomIdFromUrl } from "../../hooks/useGetRoomIdFromUrl";
import { useChooseWord } from "../../hooks/useChooseWord";
import { useGetWords } from "../../hooks/useGetWords";

const ChooseWord = memo(function ChooseWord() {
  const roomId = useGetRoomIdFromUrl();

  const { activeUser, choosedWordsList, chosenWords, isRoundEnd } =
    useAppSelector((state) => ({
      activeUser: state.drawThema.activeUser,
      chosenWords: state.drawThema.chosenWords,
      isRoundEnd: state.drawThema.isRoundEnd,
      choosedWordsList: state.drawThema.choosedWordsList,
    }));
  const { handleChooseDrawWord } = useChooseWord(roomId);
  const userName = localStorage.getItem("userName");
  useGetWords(roomId, choosedWordsList);
  const defaultOptions = {
    loop: true,
    autoplay: true,

    animationData: LottieSettings,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  console.log("ACTIOVE USER", activeUser);

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
