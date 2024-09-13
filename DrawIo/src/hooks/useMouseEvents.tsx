// hooks/useMouseEvents.ts
import { useCallback, useState } from "react";
import { fabric } from "fabric";
import { socket } from "../socket";
import { useAppDispatch } from "../store/hook";
import { setDrawColor } from "../store/slices/drawInfo";

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

  const handleMouseDown = useCallback(
    (options: fabric.IEvent) => {
      const canvas = drawRef.current;
      if (!canvas) return;

      const { x, y } = canvas.getPointer(options.e);
      const path = options.target;

      if (activeUser.userName !== userNameStorage) return;

      if (activeTool === "getColor" && path?.stroke) {
        dispatch(setDrawColor(path.stroke.toString()));
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
        socket.emit("drawing", {
          type: "start",
          x,
          y,
          roomId,
          drawingColor: canvas.freeDrawingBrush.color,
          lineWidth: canvas.freeDrawingBrush.width,
        });
        socket.emit("drawing", { type: "draw", x, y, roomId });
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
    [isMouseDown, roomId, drawRef]
  );

  const handleMouseUp = useCallback(() => {
    setIsMouseDown(false);
    if (activeUser.userName === userNameStorage) {
      socket.emit("drawing", { type: "end", roomId });
    }
  }, [activeUser.userName, roomId, userNameStorage]);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
};
