import { useEffect } from "react";
import { socket } from "../socket";
import { AppDispatch } from "../store/store";
import { setIsUserWonGame } from "../store/slices/userInfo";
import { setWinners } from "../store/slices/roomInfo";
import { Winner } from "../types/gameRoom";

export const useGameEvents = (dispatch: AppDispatch) => {
  useEffect(() => {
    const handleGameWon = (data: { winners: Winner[] }) => {
      const sortedWinners = [...data.winners].sort(
        (a, b) => b.userPoints - a.userPoints
      );

      dispatch(setIsUserWonGame(true));
      dispatch(
        setWinners([sortedWinners[0], sortedWinners[1], sortedWinners[2]])
      );
    };

    socket.on("gameWon", handleGameWon);
    socket.on("getInactiveUsers1", (userId: string) => {
      console.log("INACTIVE USER", userId);
    });

    return () => {
      socket.off("gameWon", handleGameWon);
      socket.off("getInactiveUsers1");
    };
  }, [dispatch]);
};
