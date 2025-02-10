import axios from "axios";
import { socket } from "../socket";

export const useChooseWord = (roomId: string) => {
  const handleChooseDrawWord = async (choosedWord: string) => {
    const url = "https://bottg-63go.onrender.com/wordChoosed";
    try {
      const response = await axios.post(url, {
        headers: {
          "Content-Type": "application/json",
        },
        roomId,
      });
      if (response.data) {
        socket.emit("wordChoosed", { choosedWord, roomId });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return { handleChooseDrawWord };
};
