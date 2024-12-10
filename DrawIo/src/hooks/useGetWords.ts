import { useEffect } from "react";
import { socket } from "../socket";
import { useAppDispatch } from "../store/hook";
import {
  setChoosedWord,
  setRoundCount,
  setChoosedWordsList,
  setIsGameStarted,
  setChosenWords,
} from "../store/slices/roomInfo";
import { setToolsPanel } from "../store/slices/drawInfo";
import { setIsUserDraw } from "../store/slices/userInfo";

export const useGetWords = (roomId: string, choosedWordsList: string[]) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    socket.on("getWordChoosed", (data) => {
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
  }, [roomId, choosedWordsList, dispatch]);
};
