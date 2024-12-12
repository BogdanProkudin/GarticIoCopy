// hooks/useMouseEvents.ts
import { useCallback, useRef, useState } from "react";
import { fabric } from "fabric";
import { socket } from "../socket";
import { useAppDispatch } from "../store/hook";
import { setDrawColor } from "../store/slices/drawInfo";
import { setIsUserDraw } from "../store/slices/userInfo";

export const useMouseEvents = (
  drawRef: any,
  activeUser: any,
  userNameStorage: string,
  activeTool: string,
  drawColor: string,
  roomId: string
) => {
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const isDrawing = useRef(false);

  const handleMouseDown = useCallback(
    (options: fabric.IEvent) => {
      const canvas = drawRef.current;
      if (!canvas) return;

      const { x, y } = canvas.getPointer(options.e);
      const pointer = canvas.getPointer(options.e);

      if (activeUser.userName !== userNameStorage) {
        return;
      }

      if (activeTool === "getColor") {
        // Проверяем цвет фона
        canvas.isDrawingMode = false;
        const backgroundColor = canvas.backgroundColor;

        // Получаем все объекты под курсором
        const objects = canvas.getObjects();
        const clickedObjects = objects.filter((obj: any) => {
          if (!obj.visible) return false;

          const objLeft = obj.left || 0;
          const objTop = obj.top || 0;
          const objWidth = obj.width || 0;
          const objHeight = obj.height || 0;

          return (
            pointer.x >= objLeft &&
            pointer.x <= objLeft + objWidth &&
            pointer.y >= objTop &&
            pointer.y <= objTop + objHeight
          );
        });

        // Берем самый верхний объект
        const topObject = clickedObjects[clickedObjects.length - 1];

        if (topObject) {
          // Проверяем различные свойства цвета объекта
          const objectColor = topObject.stroke || topObject.fill || null;
          if (objectColor) {
            console.log("Found object color:", objectColor);
            dispatch(setDrawColor(objectColor.toString()));
            return;
          }
        }

        // Если не нашли цвет в объектах и есть цвет фона
        if (backgroundColor && backgroundColor !== "transparent") {
          console.log("Using background color:", backgroundColor);
          dispatch(setDrawColor(backgroundColor.toString()));
          return;
        }

        // В последнюю очередь берем цвет пикселя
        const context = canvas.getContext();
        const pixel = context.getImageData(
          Math.round(pointer.x),
          Math.round(pointer.y),
          1,
          1
        ).data;
        const color = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
        console.log("Picked pixel color:", color);
        dispatch(setDrawColor(color));
        return;
      }

      if (activeTool === "bucket") {
        canvas.backgroundColor = drawColor;
        canvas.renderAll();
        socket.emit("drawing", {
          type: "bucket",
          roomId,
          drawingColor: drawColor,
        });
        return;
      }

      if (activeTool === "pen" || activeTool === "eraser") {
        canvas.isDrawingMode = true;
        isDrawing.current = true;
        setIsMouseDown(true);
        dispatch(setIsUserDraw(true));
        socket.emit("drawing", {
          type: "start",
          x,
          y,
          roomId,
          drawingColor: canvas.freeDrawingBrush.color,
          lineWidth: canvas.freeDrawingBrush.width,
        });
      }
    },
    [
      activeTool,
      activeUser,
      dispatch,
      roomId,
      userNameStorage,
      drawColor,
      drawRef,
    ]
  );

  const handleMouseMove = useCallback(
    (options: fabric.IEvent) => {
      if (!isMouseDown) return;

      const canvas = drawRef.current;
      if (!canvas) return;

      const { x, y } = canvas.getPointer(options.e);
      socket.emit("drawing", {
        type: "draw",
        x,
        y,
        roomId,
        drawingColor: canvas.freeDrawingBrush.color,
        lineWidth: canvas.freeDrawingBrush.width,
      });
    },
    [isMouseDown, roomId, drawRef, activeTool]
  );

  const handleMouseUp = useCallback(() => {
    setIsMouseDown(false);
    dispatch(setIsUserDraw(false));
    isDrawing.current = false;
    if (activeUser.userName === userNameStorage) {
      socket.emit("drawing", { type: "end", roomId });
    }
  }, [activeUser.userName, roomId, userNameStorage, activeTool]);

  return {
    isMouseDown,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
};
