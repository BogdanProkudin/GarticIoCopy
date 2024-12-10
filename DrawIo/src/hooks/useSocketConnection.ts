import { useEffect } from 'react';
import { socket } from '../socket';

export const useSocketConnection = (roomId: string) => {
  useEffect(() => {
    socket.connect();
    socket.emit("joinRoom", roomId);
    
    return () => {
      socket.disconnect();
    };
  }, [roomId]);
};
