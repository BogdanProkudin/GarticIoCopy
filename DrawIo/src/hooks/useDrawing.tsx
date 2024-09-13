// hooks/useDrawing.ts
import { useCallback } from "react";
import { IActiveUser } from "../store/slices/roomInfo";
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
  const startDrawing = (
    x: number,
    y: number,
    drawingColor: string,
    lineWidth: number
  ) => {
    contextRef.current.strokeStyle = drawingColor;
    contextRef.current.lineWidth = lineWidth;
    contextRef.current.lineCap = "round";
    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
  };

  const drawLine = (x: number, y: number) => {
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  const endDrawing = () => {
    contextRef.current.closePath();
  };

  const fillBucket = (drawingColor: string) => {
    drawRef.current.backgroundColor = drawingColor;
    drawRef.current.renderAll();
  };

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
    [activeUser, userNameLocalStorage]
  );

  return { handleDrawing };
};
