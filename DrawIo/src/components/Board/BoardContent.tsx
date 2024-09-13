import Lottie from "react-lottie";
import BoardWait from "./BoardWait";
import ChooseWord from "./ChooseWord";
import WordGuessSuccess from "./roundResult/WordGuessSuccess";
import styles from "./styles.module.scss";
interface Props {
  isGuessedAnimationFinished: boolean;
  setIsGuessedAnimationFinished: Dispatch<SetStateAction<boolean>>;
}
import LottieSettings from "../../tools/Animation - 1712170538790.json";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useAppSelector } from "../../store/hook";
import UsersNotGuessed from "./roundResult/UsersNotGuessed";

const BoardContent: React.FC<Props> = ({
  isGuessedAnimationFinished,
  setIsGuessedAnimationFinished,
}) => {
  const {
    choosedWord,
    isOneUserGuessed,
    isUsersNotGuessed,
    isGameStarted,
    isAllUsersGuessed,
  } = useAppSelector((state) => ({
    choosedWord: state.drawThema.choosedWord,
    isOneUserGuessed: state.userInfo.isOneUserGuessed,
    isUsersNotGuessed: state.userInfo.isUsersNotGuessed,
    isGameStarted: state.drawThema.isGameStarted,
    isAllUsersGuessed: state.userInfo.isAllUsersGuessed,
  }));
  const defaultLottieOptions = {
    loop: false,
    autoplay: true,

    animationData: LottieSettings,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handleAnimationComplete = () => {
    setIsGuessedAnimationFinished(true);
  };

  if (!isGameStarted) {
    return <BoardWait />;
  }

  if (choosedWord.length < 1) {
    return <ChooseWord />;
  }

  if (isUsersNotGuessed) {
    return <UsersNotGuessed />;
  }

  if (isAllUsersGuessed) {
    return <WordGuessSuccess />;
  }

  if (
    !isAllUsersGuessed &&
    isOneUserGuessed &&
    !isGuessedAnimationFinished &&
    isUsersNotGuessed
  ) {
    return (
      <div className={styles.one_user_guessed_animation_container}>
        <div className={styles.one_user_guessed_animation}>
          <Lottie
            options={defaultLottieOptions}
            isClickToPauseDisabled
            eventListeners={[
              {
                eventName: "complete",
                callback: handleAnimationComplete,
              },
            ]}
          />
        </div>
      </div>
    );
  }

  if (isAllUsersGuessed) {
    return <WordGuessSuccess />;
  }

  return <></>;
};

export default BoardContent;
