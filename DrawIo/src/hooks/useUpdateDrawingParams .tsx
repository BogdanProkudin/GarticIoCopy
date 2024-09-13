// hooks/useUpdateDrawingParams.ts
import { useEffect } from "react";
import { IActiveUser } from "../store/slices/roomInfo";

export const useUpdateDrawingParams = (
  drawRef: any,
  activeUser: IActiveUser,
  userNameStorage: string,
  activeTool: string,
  drawColor: string,
  brushWidth: string
) => {
  useEffect(() => {
    const canvas = drawRef.current;
    if (!canvas) return;

    if (activeUser.userName === userNameStorage) {
      canvas.isDrawingMode = activeTool === "pen" || activeTool === "eraser";
      canvas.freeDrawingBrush.width =
        activeTool === "eraser" ? 60 : Number(brushWidth);
      canvas.freeDrawingBrush.color =
        activeTool === "eraser" ? "white" : drawColor || "black";
      canvas.selection = false;
    }
  }, [
    activeUser.userName,
    userNameStorage,
    activeTool,
    drawColor,
    brushWidth,
    drawRef,
  ]);
};
