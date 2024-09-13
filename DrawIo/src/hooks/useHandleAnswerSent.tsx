import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { setIsOneUserGuessed } from "../store/slices/userInfo"; // Импортируйте нужный экшен
import { socket } from "../socket"; // Импортируйте ваш сокет
import { Dispatch } from "@reduxjs/toolkit";

interface UseHandleKeyPressParams {
  answersInputText: string;
  choosedWord: string;
  userNameStorage: string;
  roomId: string;
  setIsShowGuessedAnimation: (value: boolean) => void;
  setAnswersInputText: (value: string) => void;
  dispatch: Dispatch;
}

export const useHandleKeyPress = ({
  answersInputText,
  choosedWord,
  userNameStorage,
  roomId,
  setIsShowGuessedAnimation,
  setAnswersInputText,
  dispatch,
}: UseHandleKeyPressParams) => {
  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter" && answersInputText.length >= 1) {
        const isCorrectAnswer = answersInputText === choosedWord;
        if (isCorrectAnswer) {
          dispatch(setIsOneUserGuessed(true));
          setIsShowGuessedAnimation(true);
          socket.emit("answersSent", {
            userName: userNameStorage,
            message: answersInputText,
            roomId,
            isGuessed: true,
          });
          setTimeout(() => {
            setIsShowGuessedAnimation(false);
          }, 4000);
        } else {
          socket.emit("answersSent", {
            userName: userNameStorage,
            message: answersInputText,
            roomId,
          });
        }
        setAnswersInputText("");
      }
    },
    [answersInputText, choosedWord, dispatch, userNameStorage, roomId]
  );

  return handleKeyPress;
};
