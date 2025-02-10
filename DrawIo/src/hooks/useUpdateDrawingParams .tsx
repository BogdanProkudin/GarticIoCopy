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
      activeUser: activeUser.userName,
    });

    if (isActiveUser) {
      // Сначала отключаем режим рисования для всех инструментов
      canvas.isDrawingMode = false;
      canvas.selection = false;
      canvas.skipTargetFind = true;
      canvas.interactive = false;

      // Настраиваем параметры в зависимости от инструмента
      switch (activeTool) {
        case "pen":
          canvas.isDrawingMode = true;
          canvas.freeDrawingBrush.width = Number(brushWidth);
          canvas.freeDrawingBrush.color = drawColor;
          break;

        case "eraser":
          canvas.isDrawingMode = true;
          canvas.freeDrawingBrush.width = 60;
          canvas.freeDrawingBrush.color = "white";
          break;

        case "bucket":
          // Для заливки режим рисования не нужен
          canvas.isDrawingMode = false;
          break;

        case "getColor":
          // Для пипетки режим рисования должен быть выключен
          canvas.isDrawingMode = false;
          canvas.selection = true; // Разрешаем выбор объектов
          canvas.skipTargetFind = false;
          canvas.interactive = true;
          break;

        default:
          canvas.isDrawingMode = false;
          break;
      }

      console.log("Updated canvas properties:", {
        isDrawingMode: canvas.isDrawingMode,
        brushColor: canvas.freeDrawingBrush?.color,
        width: canvas.freeDrawingBrush?.width,
        tool: activeTool,
      });
    } else {
      canvas.isDrawingMode = false;
      console.log("Not active user - disabled drawing mode");
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
