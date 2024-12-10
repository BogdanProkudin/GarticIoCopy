import { useEffect } from "react";
import { socket } from "../socket";
import { setIsRoundEnd, setIsGameStarted } from "../store/slices/roomInfo";
import { setIsUserDraw } from "../store/slices/userInfo";
import { useAppDispatch } from "../store/hook";
export const useGameStarted = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const onGameStarted = () => {
      dispatch(setIsUserDraw(true));
      dispatch(setIsRoundEnd(true));

      dispatch(setIsGameStarted(true));
    };

    socket.on("gameStarted", onGameStarted);

    return () => {
      socket.off("gameStarted", onGameStarted);
    };
  }, [dispatch]);
};
