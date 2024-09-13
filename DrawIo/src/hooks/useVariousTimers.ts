import axios from "axios";
import { useCallback, useEffect } from "react";
import {
  IRoomUsers,
  setIsIntervalOver,
  setIsRoundTimerOver,
} from "../store/slices/roomInfo";
import { socket } from "../socket";
type UseVariousTimersProps = {
  functionName: string;
  dispatch?: unknown;
  isRoundEnd?: unknown;
  userName: string | null;
  activeUser: unknown;
  roomUsers?: IRoomUsers[];
  roomId: string;
  activeIndex?: number;
  isUsersNotGuessed?: boolean;
};
type TimersProps = {
  dispatch: (arg0: {
    payload: any;
    type: "drawThema/setIsRoundTimerOver";
  }) => void;
  roomId: string;
  activeIndex: number;
  roomUsers: IRoomUsers[];
};
// Определяем функции, которые могут быть возвращены хуком
const functionMap: any = {
  AllUsersGuessed: ({ roomId }: { roomId: string }) => {},

  RoundTimer: ({ roomId, activeIndex, roomUsers, dispatch }: TimersProps) => {
    const sendRoundTimer = async (url: string) => {
      try {
        const response = await axios.post(url, {
          headers: {
            "Content-Type": "application/json",
          },
          roomUsers,
          activeIndex,
          roomId,
        });

        dispatch(setIsRoundTimerOver(response.data.timer));
      } catch (error) {
        console.error("Error:", error);
      }
    };
    const url = "http://localhost:3000/roundTimer";

    sendRoundTimer(url);
  },
};

const useVariousTimers = ({
  functionName,
  activeUser,
  isRoundEnd,
  userName,
  roomUsers,
  dispatch,
  activeIndex,
  isUsersNotGuessed,
  roomId,
}: UseVariousTimersProps) => {
  const getFunction = useCallback(() => {
    const func = functionMap[functionName];

    return func || (() => console.log("Function not found"));
  }, []);

  useEffect(() => {
    if (userName === activeUser && isRoundEnd) {
      const func = getFunction();
      func({ dispatch, roomId, roomUsers, activeIndex });
      return;
    }

    if (userName === activeUser && isUsersNotGuessed) {
      const func = getFunction();
      func({ roomId });
      return;
    }
    if (userName === activeUser) {
      const func = getFunction();
      func({ roomId, activeIndex, roomUsers, dispatch });
      return;
    }
  }, [isRoundEnd, isUsersNotGuessed]);
};

export default useVariousTimers;
