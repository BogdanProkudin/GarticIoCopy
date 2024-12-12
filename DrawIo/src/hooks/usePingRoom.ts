import { useEffect } from "react";
import { NavigateFunction } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS, PING_INTERVAL, MESSAGES } from "../constants/gameRoom";

export const usePingRoom = (
  roomId: string,
  userId: string,
  navigate: NavigateFunction
) => {
  useEffect(() => {
    const pingInterval = setInterval(async () => {
      try {
        const response = await axios.post(API_ENDPOINTS.PING, {
          roomId,
          userId,
        });

        if (response.data.message === MESSAGES.ROOM_NO_LONGER_EXISTS) {
          console.log(MESSAGES.ROOM_NO_LONGER_EXISTS);
          navigate("/lobbyNotFound", { replace: true });
        }
      } catch (error) {
        console.error("Error sending ping:", error);
        navigate("/lobbyNotFound", { replace: true });
      }
    }, PING_INTERVAL);

    return () => clearInterval(pingInterval);
  }, [roomId, userId, navigate]);
};
