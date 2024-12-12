// hooks/useDrawing.ts
import { useCallback, useEffect, useRef } from "react";
import { IActiveUser } from "../store/slices/roomInfo";
import { socket } from "../socket";

type DrawingUpdate = {
  type: "start" | "draw" | "end" | "bucket" | "getColor";
  x: number;
  y: number;
  drawingColor: string;
  lineWidth: number;
};

interface IuseDrawing {
  activeUser: IActiveUser;
  userNameLocalStorage: string | null;
  contextRef: any;
  drawRef: any;
}

export const useDrawing = ({
  activeUser,
  userNameLocalStorage,
  contextRef,
  drawRef,
}: IuseDrawing) => {
  // Use ref to track if we're already drawing
  const isDrawingRef = useRef(false);

  // Memoize all drawing functions with proper dependency arrays
  const startDrawing = useCallback(
    (x: number, y: number, drawingColor: string, lineWidth: number) => {
      if (!contextRef.current || isDrawingRef.current) return;
      console.log("startDrawing");
      
      isDrawingRef.current = true;
      contextRef.current.strokeStyle = drawingColor;
      contextRef.current.lineWidth = lineWidth;
      contextRef.current.lineCap = "round";
      contextRef.current.beginPath();
      contextRef.current.moveTo(x, y);
    },
    [contextRef]
  );

  const drawLine = useCallback(
    (x: number, y: number) => {
      if (!contextRef.current || !isDrawingRef.current) return;
      contextRef.current.lineTo(x, y);
      contextRef.current.stroke();
    },
    [contextRef]
  );

  const endDrawing = useCallback(() => {
    if (!contextRef.current) return;
    contextRef.current.closePath();
    isDrawingRef.current = false;
  }, [contextRef]);

  const fillBucket = useCallback(
    (drawingColor: string) => {
      if (!drawRef.current) return;
      drawRef.current.backgroundColor = drawingColor;
      drawRef.current.renderAll();
    },
    [drawRef]
  );

  const handleDrawing = useCallback(
    ({ type, x, y, drawingColor, lineWidth }: DrawingUpdate) => {
      if (activeUser.userName === userNameLocalStorage) return;

      switch (type) {
        case "start":
          startDrawing(x, y, drawingColor, lineWidth);
          break;
        case "draw":
          drawLine(x, y);
          break;
        case "end":
          endDrawing();
          break;
        case "bucket":
          fillBucket(drawingColor);
          break;
        default:
          break;
      }
    },
    [
      activeUser.userName,
      userNameLocalStorage,
      startDrawing,
      drawLine,
      endDrawing,
      fillBucket,
    ]
  );

  // Set up socket listener
  useEffect(() => {
    socket.on("getDraw", handleDrawing);
    return () => {
      socket.off("getDraw", handleDrawing);
    };
  }, [handleDrawing]);

  return { handleDrawing };
};
