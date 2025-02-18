import { useEffect } from "react";
import { socket } from "../socket";
import { useAppDispatch } from "../store/hook";
import {
  setChoosedWord,
  setRoundCount,
  setChoosedWordsList,
  setIsGameStarted,
} from "../store/slices/roomInfo";
import { setToolsPanel } from "../store/slices/drawInfo";
import { setIsUserDraw } from "../store/slices/userInfo";

export const useGetWords = async (
  roomId: string,
  choosedWordsList: string[]
) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    socket.on("getWordChoosed", async (data) => {
      const awaitedData = await data;
      dispatch(setChoosedWord(awaitedData));
      dispatch(setToolsPanel(true));
      dispatch(setRoundCount());
      dispatch(setChoosedWordsList([...choosedWordsList, awaitedData]));
      dispatch(setIsUserDraw(false));
      dispatch(setIsGameStarted(true));
    });

    return () => {
      socket.off("getWordChoosed");
      socket.off("gameWords");
      socket.off("getWord");
    };
  }, [roomId, choosedWordsList, dispatch]);
};
