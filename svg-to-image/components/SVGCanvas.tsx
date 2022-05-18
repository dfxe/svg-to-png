import React, { useEffect, useState, useRef, useCallback } from "react";
import { saveAs } from "file-saver";

const SVGtoPNG = () => {
  const [canvas, setCanvas] = useState<HTMLCanvasElement>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  //background
  const generateBackground = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    //draw background with gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#fdfbfb");
    gradient.addColorStop(1, "red");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    //draw background with radial gradient
    const gradient2 = ctx.createRadialGradient(
      width / 2,
      height / 2,
      0,
      width / 2,
      height / 2,
      width / 2
    );
    gradient2.addColorStop(0, "red");
    gradient2.addColorStop(1, "blue");
    ctx.fillStyle = gradient2;
    ctx.fillRect(0, 0, width, height);
    //draw background with conic gradient
    //TODO recheck this
    const gradient3 = ctx.createConicGradient(0, 100, 100);

    // Add five color stops
    gradient.addColorStop(0, "red");
    gradient.addColorStop(0.25, "orange");
    gradient.addColorStop(0.5, "yellow");
    gradient.addColorStop(0.75, "green");
    gradient.addColorStop(1, "blue");

    // Set the fill style and draw a rectangle
    ctx.fillStyle = gradient3;
    ctx.fillRect(0, 0, width, height);
  };
  //shapes
  const generateShape = (
    shapePath: string,
    ctx: CanvasRenderingContext2D,

    shapeDimensions: { x: number; y: number; width: number; height: number }
  ) => {
    const shapeX: HTMLImageElement = new Image();
    shapeX.src = shapePath;
    shapeX.onload = () => {
      //img, x, y, width, height
      ctx.drawImage(
        shapeX,
        shapeDimensions.x,
        shapeDimensions.y,
        shapeDimensions.width,
        shapeDimensions.height
      );
    };
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
      const commonContext = canvas.getContext("2d");
      //best quality
      commonContext!.imageSmoothingEnabled = true;
      commonContext!.imageSmoothingQuality = "high";

      //maybe wait a bit before generating background
      generateBackground(commonContext!, 400, 400);
      drawGrid(
        ["/cc.svg", "/cc.svg"],
        { width: 400, height: 400 },
        { rows: 3, cols: 7 },
        50,
        10,
        commonContext!
      );

      //if this doesn't work, try extract the canvas.toBlob out to the nesting function
      //save immediately function.
      /* canvas!.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `${Math.random().toString(16).slice(2, -1)}.png`);
        }
      }); */
    }
  }, [canvas]);

  const generate = useCallback(() => {
    generateImages();
  }, [generateImages]);

  return (
    <div
      style={{
        display: "flex",

        flexDirection: "column",
      }}
    >
      {/* download anchor IS NOT ON THE FEATURE LIST so stop */}

      <canvas
        style={{
          width: "100%",
          height: "100%",

          transform: "translate(0,0)",
        }}
        aria-label="canvas-label"
        ref={canvasRef}
      >
        <p>Can not display canvas.</p>
      </canvas>

      <br></br>
      <button onClick={() => generate()} style={{ padding: "1em" }}>
        Generate
      </button>
    </div>
  );
};

export default SVGtoPNG;
