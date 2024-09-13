// // hooks/useInitializeCanvas.ts
// import { MutableRefObject, useEffect } from "react";
// import { fabric } from "fabric";
// import { socket } from "../socket";
// interface IuseInitializeCanvas {
//   canvasRef: React.RefObject<HTMLCanvasElement>;
//   drawRef: any;
//   contextRef: MutableRefObject<CanvasRenderingContext2D | null>;
//   activeUser: any;
//   userNameStorage: string | null;
//   roomId: string;
// }
// export const useInitializeCanvas = ({
//   canvasRef,
//   activeUser,
//   contextRef,
//   roomId,
//   drawRef,
//   userNameStorage,
// }: IuseInitializeCanvas) => {
//   useEffect(() => {
//     const canvas = new fabric.Canvas(canvasRef.current, {
//       width: 650,
//       height: 400,
//       backgroundColor: "white",
//       isDrawingMode: false,
//       selectionFullyContained: false,
//       selection: false,
//     });

//     canvas.hoverCursor = "crosshair";
//     canvas.moveCursor = "crosshair";
//     canvas.defaultCursor = "crosshair";

//     drawRef.current = canvas;
//     contextRef.current = canvas.getContext() as CanvasRenderingContext2D;

//     const handleDraw = (data: any) => {
//       if (
//         data.type === "path" &&
//         drawRef.current &&
//         activeUser.userName &&
//         activeUser.userName !== userNameStorage
//       ) {
//         const path = new fabric.Path(data.path, data.options);
//         drawRef.current.add(path);
//         drawRef.current.renderAll();
//         canvas.selection = false;
//         drawRef.current.forEachObject((obj: any) => {
//           obj.selectable = false;
//         });
//       }
//     };

//     socket.on("getDraw2", handleDraw);

//     canvas.on("path:created", (e: any) => {
//       const path = e.path;
//       const pathData = {
//         type: "path",
//         roomId,
//         path: path.path,
//         options: path.toObject([
//           "left",
//           "top",
//           "fill",
//           "stroke",
//           "strokeWidth",
//         ]),
//       };
//       canvas.renderAll();
//       socket.emit("drawing2", pathData);
//     });

//     return () => {
//       canvas.dispose();
//       socket.off("getDraw2", handleDraw);
//     };
//   }, [roomId, activeUser.userName, userNameStorage]);
// };

import { MutableRefObject, useEffect, useCallback } from "react";
import { fabric } from "fabric";
import { socket } from "../socket";

interface IuseInitializeCanvas {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  drawRef: any;
  contextRef: MutableRefObject<CanvasRenderingContext2D | null>;
  activeUser: any;
  userNameStorage: string | null;
  roomId: string;
}

export const useInitializeCanvas = ({
  canvasRef,
  activeUser,
  contextRef,
  roomId,
  drawRef,
  userNameStorage,
}: IuseInitializeCanvas) => {
  const handleDraw = useCallback(
    (data: any) => {
      if (
        data.type === "path" &&
        drawRef.current &&
        activeUser.userName &&
        activeUser.userName !== userNameStorage
      ) {
        const path = new fabric.Path(data.path, data.options);
        drawRef.current.add(path);
        drawRef.current.renderAll();
        drawRef.current.selection = false;
        drawRef.current.forEachObject((obj: any) => {
          obj.selectable = false;
        });
      }
    },
    [activeUser.userName, userNameStorage, drawRef]
  );

  const handlePathCreated = useCallback(
    (e: any) => {
      const path = e.path;
      const pathData = {
        type: "path",
        roomId,
        path: path.path,
        options: path.toObject([
          "left",
          "top",
          "fill",
          "stroke",
          "strokeWidth",
        ]),
      };
      drawRef.current.renderAll();
      socket.emit("drawing2", pathData);
    },
    [roomId, drawRef]
  );

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 650,
      height: 400,
      backgroundColor: "white",
      isDrawingMode: false,
      selectionFullyContained: false,
      selection: false,
    });

    canvas.hoverCursor = "crosshair";
    canvas.moveCursor = "crosshair";
    canvas.defaultCursor = "crosshair";

    drawRef.current = canvas;
    contextRef.current = canvas.getContext() as CanvasRenderingContext2D;

    socket.on("getDraw2", handleDraw);
    canvas.on("path:created", handlePathCreated);

    return () => {
      canvas.dispose();
      socket.off("getDraw2", handleDraw);
      canvas.off("path:created", handlePathCreated);
    };
  }, [handleDraw, handlePathCreated, canvasRef, drawRef, contextRef]);
};
