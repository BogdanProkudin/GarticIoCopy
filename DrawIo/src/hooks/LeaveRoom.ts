import { useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import { useAppDispatch } from "../store/hook";
import { handleleaveRoom } from "../store/slices/drawThema";

const useLeaveRoomOnUnload = (
  socket: Socket,
  roomId: string,
  userName: string | null
) => {
  const dispatch = useAppDispatch();
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (isActive) {
      let timeoutId: number | undefined;

      const handleUserInactive = async () => {
        await dispatch(handleleaveRoom({ roomId, userName }));

        setIsActive(false);
      };

      const handleUserActive = () => {
        setIsActive(true);
        if (timeoutId) clearTimeout(timeoutId);
        resetTimeout();
      };

      const resetTimeout = () => {
        if (!isActive) return;
        timeoutId = setTimeout(handleUserInactive, 300000);
      };

      document.addEventListener("mousemove", handleUserActive);
      document.addEventListener("keydown", handleUserActive);
      document.addEventListener("resize", handleUserActive);

      resetTimeout();

      return () => {
        if (timeoutId) clearTimeout(timeoutId);
        document.removeEventListener("mousemove", handleUserActive);
        document.removeEventListener("keydown", handleUserActive);
        document.removeEventListener("resize", handleUserActive);
      };
    }
  }, [socket, roomId, userName, dispatch, isActive]);

  return {
    isActive,
  };
};

export default useLeaveRoomOnUnload;
