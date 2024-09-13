import { useCallback } from "react";
import { AnswerTypes } from "../components/gameRoom/gameRoomInteractions/answers/gameRoomAnswers";
import { Dispatch } from "@reduxjs/toolkit";
import { IActiveUser, setUsersGuessed } from "../store/slices/roomInfo";

interface IGameRoomAnswersProps {
  roomId: string;
  message: string;
  userName: string;
  isGuessed: boolean;
}
interface IUseHandleAnswerReceived {
  userNameStorage: string;

  setAnswers: React.Dispatch<React.SetStateAction<AnswerTypes[]>>;
  dispatch: Dispatch;
  usersGuessed: string[];
  activeUser: IActiveUser;
}
export const useHandleAnswerReceived = ({
  userNameStorage,

  setAnswers,
  dispatch,
  activeUser,
  usersGuessed,
}: IUseHandleAnswerReceived) => {
  const handleAnswerReceived = useCallback(
    async (data: IGameRoomAnswersProps) => {
      if (data.isGuessed && userNameStorage) {
        dispatch(setUsersGuessed([...usersGuessed, data.userName]));
      }
      console.log("RECIEVE MESSAGE SOCKEt ", data);

      const newMessage = {
        userName: data.userName,
        message: data.message,
        isGuessed: !!data.isGuessed,
      };

      setAnswers((prev) => [...prev, newMessage]);
    },
    [dispatch, usersGuessed, userNameStorage, activeUser]
  );

  return handleAnswerReceived;
};
