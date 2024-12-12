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
      const objects = canvas.getObjects();

      if (activeUser.userName !== userNameStorage) {
        return;
      }

      if (isDrawing.current) {
        isDrawing.current = false;
        setIsMouseDown(false);
        return;
      }

      isDrawing.current = true;

      if (activeTool === "getColor") {
        // Находим все объекты под курсором
        const clickedObjects = objects.filter((obj: any) => {
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

        const topObject = clickedObjects[clickedObjects.length - 1];

        if (topObject && topObject.stroke) {
          console.log("Found color:", topObject.stroke);
          dispatch(setDrawColor(topObject.stroke.toString()));
        } else {
          const context = canvas.getContext();
          const pixel = context.getImageData(pointer.x, pointer.y, 1, 1).data;
          const color = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
          console.log("Picked pixel color:", color);
          dispatch(setDrawColor(color));
        }
      }

      if (activeTool === "bucket") {
        canvas.backgroundColor = drawColor;
        canvas.renderAll();
        socket.emit("drawing", {
          type: "bucket",
          roomId,
          drawingColor: drawColor,
        });
      }

      if (activeTool === "pen" || activeTool === "eraser") {
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
      socket.emit("drawing", { type: "draw", x, y, roomId });
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
