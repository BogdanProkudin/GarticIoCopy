import { useEffect, useRef, useCallback } from 'react';
import { socket } from '../socket';
import { Socket } from 'socket.io-client';

type SocketEventCallback = (...args: any[]) => void;

export const useSocket = () => {
  const socketRef = useRef<Socket>(socket);

  const emit = useCallback((eventName: string, data: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(eventName, data);
    }
  }, []);

  const on = useCallback((eventName: string, callback: SocketEventCallback) => {
    if (socketRef.current?.connected) {
      socketRef.current.on(eventName, callback);
    }
  }, []);

  const off = useCallback((eventName: string, callback?: SocketEventCallback) => {
    if (socketRef.current?.connected) {
      if (callback) {
        socketRef.current.off(eventName, callback);
      } else {
        socketRef.current.off(eventName);
      }
    }
  }, []);

  useEffect(() => {
    const currentSocket = socketRef.current;

    return () => {
      if (currentSocket?.connected) {
        currentSocket.removeAllListeners();
      }
    };
  }, []);

  return { emit, on, off, socket: socketRef.current };
};
