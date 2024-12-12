import { useEffect, useRef, useState, useCallback } from "react";
import { useSocket } from "./useSocket";
import { CANVAS_SETTINGS } from "../constants/game";

interface DrawingEvent {
  x: number;
  y: number;
  roomId: string;
  type: "start" | "draw" | "end";
}

export const useCanvas = (roomId: string) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const { emit } = useSocket();
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = CANVAS_SETTINGS.CANVAS_WIDTH;
    canvas.height = CANVAS_SETTINGS.CANVAS_HEIGHT;

    // Set default styles
    ctx.strokeStyle = CANVAS_SETTINGS.DEFAULT_COLOR;
    ctx.lineWidth = CANVAS_SETTINGS.DEFAULT_LINE_WIDTH;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    contextRef.current = ctx;

    // Set background
    ctx.fillStyle = CANVAS_SETTINGS.BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = useCallback(
    (event: MouseEvent) => {
      const canvas = canvasRef.current;
      const ctx = contextRef.current;
      if (!canvas || !ctx) return;
      console.log("TRUEEE");

      setIsDrawing(true);
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      emit("drawing", {
        type: "start",
        x,
        y,
        roomId,
      });
    },
    [emit, roomId]
  );

  const draw = useCallback(
    (e: MouseEvent) => {
      if (!isDrawing) return;

      const canvas = canvasRef.current;
      const ctx = contextRef.current;
      if (!canvas || !ctx) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      ctx.lineTo(x, y);
      ctx.stroke();

      const drawingEvent: DrawingEvent = {
        x,
        y,
        roomId,
        type: "draw",
      };
      emit("drawing", drawingEvent);
    },
    [isDrawing, roomId, emit]
  );

  const stopDrawing = useCallback(() => {
    const ctx = contextRef.current;
    if (!ctx) return;
    console.log("STOP DRAWING");

    setIsDrawing(false);
    ctx.closePath();

    emit("drawing", {
      type: "end",
      x: 0,
      y: 0,
      roomId,
    });
  }, [emit, roomId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing);

    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseleave", stopDrawing);
    };
  }, [startDrawing, draw, stopDrawing]);

  return { canvasRef, isDrawing };
};
