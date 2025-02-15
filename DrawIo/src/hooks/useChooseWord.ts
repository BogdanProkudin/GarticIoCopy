import axios from "axios";
import { socket } from "../socket";

export const useChooseWord = (roomId: string) => {
  const handleChooseDrawWord = async (choosedWord: string) => {
    const url = "https://bottg-63go.onrender.com/wordChoosed";
    try {
      socket.emit("wordChoosed", { choosedWord, roomId });
      const response = await axios.post(url, {
        headers: {
          "Content-Type": "application/json",
        },
        roomId,
      });

      if (response.data) {
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return { handleChooseDrawWord };
};
