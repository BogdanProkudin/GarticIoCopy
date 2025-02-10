import { useRef, useEffect, MutableRefObject, memo } from "react";

import { useAppSelector } from "../../store/hook";

import styles from "./styles.module.scss";
import { useInitializeCanvas } from "../../hooks/useInitializeCanvas";
import { useMouseEvents } from "../../hooks/useMouseEvents";
import { useUpdateDrawingParams } from "../../hooks/useUpdateDrawingParams ";

interface DrawingCanvasProps {
  roomId: string;
  contextRef: MutableRefObject<CanvasRenderingContext2D | null>;
  drawRef: any;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  roomId,
  contextRef,
  drawRef,
}) => {
  const brushWidth = useAppSelector((state) => state.drawInfo.brushWidth);
  const activeUser = useAppSelector((state) => state.drawThema.activeUser);
  const drawColor: string = useAppSelector((state) => state.drawInfo.drawColor);
  const userNameStorage = localStorage.getItem("userName");
  const activeTool: string = useAppSelector(
    (state) => state.drawInfo.activeTool
  );
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useInitializeCanvas({
    userNameStorage,
    activeUser,
    roomId,
    canvasRef,
    contextRef,
    drawRef,
  });
  useUpdateDrawingParams(
    drawRef,
    activeUser,
    userNameStorage!,
    activeTool,
    drawColor,
    brushWidth
  );

  const { handleMouseDown, handleMouseMove, handleMouseUp } = useMouseEvents(
    drawRef,
    activeUser,
    userNameStorage!,
    activeTool,
    drawColor,
    roomId
  );
  useEffect(() => {
    const canvas = drawRef.current;
    if (!canvas) return;

    canvas.on("mouse:down", handleMouseDown);
    canvas.on("mouse:up", handleMouseUp);

    if (activeTool === "pen" || activeTool === "eraser") {
      canvas.on("mouse:move", handleMouseMove);
      return () => canvas.off("mouse:move", handleMouseMove);
    }

    return () => {
      canvas.off("mouse:down", handleMouseDown);
      canvas.off("mouse:up", handleMouseUp);
    };
  }, [handleMouseDown, handleMouseUp, handleMouseMove, activeTool]);

  return (
    <div>
      <canvas className={styles.canvas_content} ref={canvasRef} />
    </div>
  );
};

export default memo(DrawingCanvas);
