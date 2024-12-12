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
    if (!canvas) {
      console.log("Canvas not initialized");
      return;
    }

    const isActiveUser = activeUser.userName === userNameStorage;
    console.log("Updating drawing params:", {
      isActiveUser,
      activeTool,
      drawColor,
      brushWidth,
      currentUser: userNameStorage,
      activeUser: activeUser.userName
    });

    if (isActiveUser) {
      const isDrawingMode = activeTool === "pen" || activeTool === "eraser";
      const brushColor = activeTool === "eraser" ? "white" : drawColor || "black";
      const width = activeTool === "eraser" ? 60 : Number(brushWidth);

      canvas.isDrawingMode = isDrawingMode;
      canvas.freeDrawingBrush.width = width;
      canvas.freeDrawingBrush.color = brushColor;
      canvas.selection = false;

      console.log("Updated canvas properties:", {
        isDrawingMode,
        brushColor,
        width
      });
    } else {
      console.log("Not active user - skipping drawing param updates");
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
