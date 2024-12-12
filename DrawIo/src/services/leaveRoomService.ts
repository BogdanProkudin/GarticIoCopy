import axios from "axios";
import { socket } from "../socket";
import { MESSAGES } from "../constants/messages";
import { API_ENDPOINTS } from "../constants/gameRoom";

export interface LeaveRoomError {
  message: string;
  code: string;
}

export class LeaveRoomService {
  static async leaveRoom(roomId: string, userName: string): Promise<void> {
    try {
      await axios.post(API_ENDPOINTS.USER_LEAVE_ROOM, {
        roomId,
        userName,
      });

      socket.emit("leaveRoom", { roomId, userName });
      localStorage.removeItem("userName");
    } catch (error) {
      console.error("Error leaving room:", error);
      throw this.handleError(error);
    }
  }

  static async checkRoomExists(roomId: string): Promise<boolean> {
    try {
      const response = await axios.get(`${API_ENDPOINTS.GET_ROOM_DATA}`, {
        params: { roomId },
      });
      return !!response.data;
    } catch (error) {
      return false;
    }
  }

  private static handleError(error: any): LeaveRoomError {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return {
          message: MESSAGES.ROOM_NOT_FOUND,
          code: "ROOM_NOT_FOUND",
        };
      }
      return {
        message: error.response?.data?.message || "Unknown error",
        code: "NETWORK_ERROR",
      };
    }
    return {
      message: "Unknown error occurred",
      code: "UNKNOWN_ERROR",
    };
  }
}
