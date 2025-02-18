import { RefObject } from "react";

class Point {
  x: number;
  y: number;
  lifetime: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.lifetime = 0;
  }
}
export const useWelcomePageCursorTrail = ({
  canvasRef,
}: {
  canvasRef: RefObject<HTMLCanvasElement>;
}) => {
  const startAnimation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const points: Point[] = [];

    const addPoint = (x: number, y: number) => {
      points.push(new Point(x, y));
    };

    const handleMouseMove = (e: MouseEvent) => {
      addPoint(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    };

    document.addEventListener("mousemove", handleMouseMove);

    const animatePoints = () => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      const duration = (0.7 * 1000) / 40; // Lasts 80% of a frame per point

      for (let i = 0; i < points.length; i++) {
        const point = points[i];
        const lastPoint = points[i - 1] ?? point;

        point.lifetime += 0.6;

        if (point.lifetime > duration) {
          points.shift();
        } else {
          const lifePercent = point.lifetime / duration;
          const spreadRate = 7 * (1 - lifePercent);

          ctx.lineJoin = "round";
          ctx.lineWidth = spreadRate;

          ctx.strokeStyle = `rgba(0,35,149,0.5)`;

          ctx.beginPath();
          ctx.moveTo(lastPoint.x, lastPoint.y);
          ctx.lineTo(point.x, point.y);
          ctx.stroke();
          ctx.closePath();
        }
      }

      requestAnimationFrame(animatePoints);
    };

    animatePoints();

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  };

  return { startAnimation };
};
