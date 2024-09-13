import { FaPen } from "react-icons/fa";
import styles from "../../styles.module.scss";
import Lottie from "react-lottie";
import LottieSettings from "../../../../tools/Animation - 1712178550440.json";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useAppSelector } from "../../../../store/hook";
interface AnswerInputProps {
  isShowGuessedAnimation: boolean;
  setAnswersInputText: Dispatch<SetStateAction<string>>;
  answersInputText: string;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  isUserGuessed: boolean;
}
const AnswerInput: React.FC<AnswerInputProps> = ({
  isShowGuessedAnimation,
  setAnswersInputText,
  answersInputText,
  handleKeyPress,
  isUserGuessed,
}) => {
  const defaultLottieOptions = {
    loop: true,
    autoplay: true,

    animationData: LottieSettings,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const isGameStarted = useAppSelector(
    (state) => state.drawThema.isGameStarted
  );
  const choosedWord = useAppSelector((state) => state.drawThema.choosedWord);
  const userNameStorage = localStorage.getItem("userName");
  const activeUser = useAppSelector((state) => state.drawThema.activeUser);
  const IsRoundTimerOver = useAppSelector(
    (state) => state.drawThema.isRoundTimerOver
  );
  const isRoundEnd = useAppSelector((state) => state.drawThema.isRoundEnd);
  const isUserNotGuessedStarted = useAppSelector(
    (state) => state.userInfo.isUserNotGuessedStarted
  );

  return (
    <>
      <FaPen color="grey" fontSize={20} className={styles.answer_input_icon} />
      <div
        style={{ visibility: isShowGuessedAnimation ? "visible" : "hidden" }}
        className={styles.game_room_correct_answer_animation}
      >
        <div className={styles.correct_answer_input_animation}>
          <Lottie options={defaultLottieOptions} isClickToPauseDisabled />
        </div>
      </div>
      <input
        onChange={(e) => setAnswersInputText(e.target.value)}
        placeholder={
          userNameStorage === activeUser.userName &&
          isRoundEnd &&
          !isUserNotGuessedStarted
            ? "You drawing"
            : !isGameStarted
            ? "Game is not started"
            : choosedWord.length < 1 && isRoundEnd
            ? "User choose word to start"
            : !isRoundEnd
            ? "Interval"
            : isUserNotGuessedStarted
            ? "Someone didnt guessed"
            : isUserGuessed
            ? "You already guessed the word"
            : `Take a guess...`
        } //доделать плэйсхолдер
        disabled={
          userNameStorage === activeUser.userName ||
          !isGameStarted ||
          choosedWord.length < 1 ||
          isUserGuessed ||
          isUserNotGuessedStarted
        }
        value={answersInputText}
        className={styles.game_room_answers_input}
        onKeyDown={handleKeyPress}
      />
    </>
  );
};

export default AnswerInput;
