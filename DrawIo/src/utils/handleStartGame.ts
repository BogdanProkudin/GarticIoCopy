import axios from "axios";
import { socket } from "../socket";
import { IRoomUsers, setIsIntervalOver } from "../store/slices/roomInfo";
interface IhandleGameStartButton {
  roomUsers: IRoomUsers[];
  activeIndex: number;
  roomId: string;
  words: string[];
  dispatch: any;
  maxGamePoints: number;
}
export const handleGameStartButton = async ({
  roomId,
  roomUsers,
  activeIndex,
  maxGamePoints,
  words,
  dispatch,
}: IhandleGameStartButton) => {
  const sendGameStart = async (url: string) => {
    try {
      await axios.post(url, {
        headers: {
          "Content-Type": "application/json",
        },
        users: roomUsers,
        roomId,
        maxGamePoints,
      });
      // socket.emit("usersNotGuessedTimer", roomId);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const sendYourTurn = async (url: string) => {
    try {
      const response = await axios.post(url, {
        headers: {
          "Content-Type": "application/json",
        },
        roomId,
        activeIndex,
        roomUsers,
      });
      dispatch(setIsIntervalOver(response.data.timer));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const url = "http://localhost:3000/startNewGame";

  await sendGameStart(url);

  socket.emit("startGame", { words: words, roomId });
  const url2 = "http://localhost:3000/yourTurn";
  await sendYourTurn(url2);
};
