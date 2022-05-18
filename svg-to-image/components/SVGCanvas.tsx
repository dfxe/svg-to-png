import React, { useEffect, useState, useRef, useCallback } from "react";
import { saveAs } from "file-saver";

const SVGtoPNG = () => {
  const [canvas, setCanvas] = useState<HTMLCanvasElement>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateShape = (
    shapePath: string,
    canvasState: HTMLCanvasElement,
    contextFromCanvasState: CanvasRenderingContext2D,
    shapeDimensions: { x: number; y: number; width: number; height: number }
  ) => {
    const shapeX: HTMLImageElement = new Image();
    shapeX.src = shapePath;
    shapeX.onload = () => {
      //img, x, y, width, height
      contextFromCanvasState.drawImage(
        shapeX,
        shapeDimensions.x,
        shapeDimensions.y,
        shapeDimensions.width,
        shapeDimensions.height
      );
    };
    //if this doesn't work, try extract the canvas.toBlob out to the nesting function
    canvasState!.toBlob((blob) => {
      if (blob) {
        saveAs(blob, `${Math.random().toString(16).slice(2, -1)}.png`);
      }
    });
  };
  // grid drawing utilities
  const drawGrid = (
    pathsToDrawFrom: string[],
    canvasDimensions: { width: number; height: number },
    rowsAndCols: { rows: number; cols: number },

    gridGap: number,
    padding: number,
    ctx: CanvasRenderingContext2D
  ) => {
    const gridWidth = canvasDimensions.width / rowsAndCols.cols;
    const gridHeight = canvasDimensions.height / rowsAndCols.rows;
    const gridGapWidth = gridWidth + gridGap;
    const gridGapHeight = gridHeight + gridGap;
    //padding should act as a buffer around the grid
    const gridX = padding;
    const gridY = padding;
    const gridWidthWithPadding = gridWidth - padding * 2;
    const gridHeightWithPadding = gridHeight - padding * 2;
    const gridGapWidthWithPadding = gridGapWidth - padding * 2;
    const gridGapHeightWithPadding = gridGapHeight - padding * 2;

    for (let i = 0; i < rowsAndCols.rows; i++) {
      for (let j = 0; j < rowsAndCols.cols; j++) {
        generateShape(
          //somehow math random is not working here
          pathsToDrawFrom[0],
          canvas!,
          ctx,
          {
            x: j * gridGap,
            y: i * gridGap,
            width: 50,
            height: 50,
          }
        );
      }
    }
  };
  useEffect(() => {
    if (canvasRef.current) {
      setCanvas(canvasRef?.current);
    }
  }, [canvasRef]);
  const generateImages = useCallback(() => {
    if (canvas) {
      //set width and height of image to 100

      drawGrid(
        ["/cc.svg", "/cc.svg"],
        { width: 400, height: 400 },
        { rows: 2, cols: 2 },
        50,
        10,
        canvas.getContext("2d")!
      );
    }
  }, [canvas]);

  const generate = useCallback(() => {
    generateImages();
  }, [generateImages]);

  return (
    <div
      style={{
        position: "absolute",
        transform: "translate(-50%,-50%)",
        left: "50%",
        top: "50%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <canvas
        style={{
          width: "200%",
          height: "200%",
          transform: "translate(0,0)",
        }}
        aria-label="canvas-label"
        ref={canvasRef}
      >
        <p>Can not display canvas.</p>
      </canvas>

      <button onClick={() => generate()} style={{ padding: "1em" }}>
        Generate
      </button>
    </div>
  );
};

export default SVGtoPNG;
