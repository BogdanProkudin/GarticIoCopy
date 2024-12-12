import { useState, useEffect, useCallback } from "react";
import { useAppDispatch } from "../store/hook";
import { handleleaveRoom } from "../store/slices/roomInfo";
import { TIMEOUTS } from "../constants/timeouts";
import { MESSAGES } from "../constants/messages";
import { LeaveRoomService } from "../services/leaveRoomService";
import { useNavigate } from "react-router-dom";

interface UseLeaveRoomState {
  isActive: boolean;
  isLeaving: boolean;
  showWarning: boolean;
  timeToDisconnect: number;
}

const useLeaveRoomOnUnload = (roomId: string, userName: string | null) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [state, setState] = useState<UseLeaveRoomState>({
    isActive: true,
    isLeaving: false,
    showWarning: false,
    timeToDisconnect: 0,
  });

  // Синхронизация состояния между вкладками
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "roomActivity") {
        const activity = JSON.parse(e.newValue || "{}");
        if (activity.roomId === roomId) {
          setState(prev => ({ ...prev, isActive: activity.isActive }));
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [roomId]);

  const updateActivity = useCallback(
    (isActive: boolean) => {
      setState(prev => ({ ...prev, isActive }));
      localStorage.setItem(
        "roomActivity",
        JSON.stringify({ roomId, isActive })
      );
    },
    [roomId]
  );

  const handleLeaveRoom = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLeaving: true }));
      await LeaveRoomService.leaveRoom(roomId, userName!);
      navigate("/");
    } catch (error) {
      console.error("Error leaving room:", error);
      if ((error as any).code === "ROOM_NOT_FOUND") {
        navigate("/");
      }
    } finally {
      setState(prev => ({ ...prev, isLeaving: false }));
    }
  }, [roomId, userName, navigate]);

  useEffect(() => {
    if (state.isActive) {
      let inactivityTimer: NodeJS.Timeout;
      let warningTimer: NodeJS.Timeout;

      const handleUserInactive = async () => {
        await handleLeaveRoom();
        updateActivity(false);
      };

      const showInactivityWarning = () => {
        setState(prev => ({
          ...prev,
          showWarning: true,
          timeToDisconnect: Math.floor(
            (TIMEOUTS.INACTIVITY - TIMEOUTS.INACTIVITY_WARNING) / 1000
          ),
        }));
      };

      const resetTimers = () => {
        if (inactivityTimer) clearTimeout(inactivityTimer);
        if (warningTimer) clearTimeout(warningTimer);

        warningTimer = setTimeout(
          showInactivityWarning,
          TIMEOUTS.INACTIVITY_WARNING
        );
        inactivityTimer = setTimeout(handleUserInactive, TIMEOUTS.INACTIVITY);
      };

      const handleUserActivity = () => {
        updateActivity(true);
        setState(prev => ({ ...prev, showWarning: false }));
        resetTimers();
      };

      document.addEventListener("mousemove", handleUserActivity);
      document.addEventListener("keydown", handleUserActivity);
      document.addEventListener("resize", handleUserActivity);

      resetTimers();

      return () => {
        if (inactivityTimer) clearTimeout(inactivityTimer);
        if (warningTimer) clearTimeout(warningTimer);
        document.removeEventListener("mousemove", handleUserActivity);
        document.removeEventListener("keydown", handleUserActivity);
        document.removeEventListener("resize", handleUserActivity);
      };
    }
  }, [state.isActive, roomId, userName, handleLeaveRoom, updateActivity]);

  return {
    ...state,
    handleLeaveRoom,
  };
};

export default useLeaveRoomOnUnload;
