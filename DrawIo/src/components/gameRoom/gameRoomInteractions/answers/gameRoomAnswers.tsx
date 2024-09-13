import { useCallback, useEffect, useRef, useState } from "react";
import styles from "../../styles.module.scss";

import { socket } from "../../../../socket";

import { useAppDispatch, useAppSelector } from "../../../../store/hook";

import Answer from "./Answer";
import AnswerInput from "./AnsweInput";

import {
  useNotifyOneUserGuessed,
  useUpdateUserGuessedStatus,
} from "../../../../hooks/useUserGuessed";
import { useHandleKeyPress } from "../../../../hooks/useHandleAnswerSent";
import { useHandleAnswerReceived } from "../../../../hooks/useHandleAnswerReceived";
import AnswerList from "./AnswerList";
import { useGetRoomIdFromUrl } from "../../../../hooks/useGetRoomIdFromUrl";

export interface AnswerTypes {
  userName: string;
  message: string;
  isGuessed?: boolean;
  isAllGuessed?: boolean;
}

const GameRoomAnswers = () => {
  const [answers, setAnswers] = useState<AnswerTypes[]>([]);

  const [isShowGuessedAnimation, setIsShowGuessedAnimation] = useState(false);
  const [answersInputText, setAnswersInputText] = useState("");
  const usersGuessed = useAppSelector((state) => state.drawThema.usersGuessed);
  const userNameStorage = localStorage.getItem("userName") || "";
  const roomId = useGetRoomIdFromUrl();
  const dispatch = useAppDispatch();
  const choosedWord = useAppSelector((state) => state.drawThema.choosedWord);
  const activeIndex = useAppSelector((state) => state.drawThema.activeIndex);
  const activeUser = useAppSelector((state) => state.drawThema.activeUser);
  const isOneUserGuessed = useAppSelector(
    (state) => state.userInfo.isOneUserGuessed
  );
  const isUsersNotGuessed = useAppSelector(
    (state) => state.userInfo.isUsersNotGuessed
  );
  const roomUsers = useAppSelector((state) => state.drawThema.roomUsers);

  const handleAnswerReceived = useHandleAnswerReceived({
    userNameStorage,
    usersGuessed,

    activeUser,
    dispatch,
    setAnswers,
  });

  useEffect(() => {
    socket.on("getAnswer", handleAnswerReceived);
    return () => {
      socket.off("getAnswer", handleAnswerReceived);
    };
  }, [handleAnswerReceived]);
  useNotifyOneUserGuessed({
    usersGuessed,
    roomUsers,
    roomId,
    userNameStorage,
    activeUser,
    activeIndex,
  });

  useUpdateUserGuessedStatus({
    usersGuessed,
    roomUsers,
    activeUser,
    userNameStorage,

    dispatch,
  });
  const handleKeyPress = useHandleKeyPress({
    answersInputText,
    choosedWord,
    userNameStorage,
    roomId,
    setIsShowGuessedAnimation,
    setAnswersInputText,
    dispatch,
  });

  return (
    <div className={styles.game_room_answers_container}>
      <h5>ANSWERS</h5>
      <AnswerList answers={answers} />
      <footer className={styles.game_room_answers_input_container}>
        <AnswerInput
          isUserGuessed={isOneUserGuessed}
          isShowGuessedAnimation={isShowGuessedAnimation}
          setAnswersInputText={setAnswersInputText}
          answersInputText={answersInputText}
          handleKeyPress={handleKeyPress}
        />
      </footer>
    </div>
  );
};

export default GameRoomAnswers;
