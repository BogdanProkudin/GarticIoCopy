import { fabric } from "fabric";
import {
  useState,
  useRef,
  useEffect,
  useCallback,
  MutableRefObject,
  memo,
} from "react";
import { socket } from "../../socket";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { setDrawColor } from "../../store/slices/drawInfo";
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

  // useEffect(() => {
  //   const canvas = new fabric.Canvas(canvasRef.current, {
  //     width: 650,
  //     height: 400,
  //     backgroundColor: "white",
  //     isDrawingMode: false,
  //     selectionFullyContained: false,
  //     selection: false,
  //   });

  //   canvas.hoverCursor = "crosshair";
  //   canvas.moveCursor = "crosshair";
  //   canvas.defaultCursor = "crosshair";

  //   drawRef.current = canvas;
  //   contextRef.current = canvas.getContext() as CanvasRenderingContext2D;

  //   socket.on("getDraw2", (data: any) => {
  //     if (
  //       data.type === "path" &&
  //       drawRef.current &&
  //       activeUser.userName &&
  //       activeUser.userName !== userNameStorage
  //     ) {
  //       const path = new fabric.Path(data.path, data.options);
  //       drawRef.current.add(path);
  //       drawRef.current.renderAll();
  //       canvas.selection = false;
  //       drawRef.current.forEachObject((obj: any) => {
  //         obj.selectable = false;
  //       });
  //     }
  //   });

  //   canvas.on("path:created", (e: any) => {
  //     const path = e.path;
  //     const pathData = {
  //       type: "path",
  //       roomId,
  //       path: path.path,
  //       options: path.toObject([
  //         "left",
  //         "top",
  //         "fill",
  //         "stroke",
  //         "strokeWidth",
  //       ]),
  //     };
  //     canvas.renderAll();
  //     socket.emit("drawing2", pathData);
  //   });

  //   return () => {
  //     canvas.dispose();
  //   };
  // }, [roomId, activeUser.userName, userNameStorage]);

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
