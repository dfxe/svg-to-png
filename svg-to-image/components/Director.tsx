import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  build,
  RectangleOptions,
  GridOptions,
  BlobOptions,
} from "./CanvasBuilder";

const Director = () => {
  const [canvas, setCanvas] = useState<HTMLCanvasElement>();
  const [backgroundOptions, setBackgroundOptions] = useState<RectangleOptions>({
    x: 5,
    y: 5,
    width: 280,
    height: 140,
    radius: 20,
    fill: "red",
    stroke: false,
  });
  const [gridOptions, setGridOptions] = useState<GridOptions>({
    pathsToDrawFrom: ["/cc.svg"],
    canvasDimensions: { width: 280, height: 100 },
    gridDimensions: {
      rows: 5,
      cols: 5,
      cellSize: { width: 50, height: 50 },
      gridGap: 5,
      padding: 5,
    },
  });
  const [blobOptions, setBlobOptions] = useState<BlobOptions>({
    numOfPolygons: 2,
    polygonDimensions: {
      size: 100,
      grow: 4,
      edges: 3,
      seed: Math.random() * 100,
    },
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateImages = useCallback(() => {
    if (canvas) {
      //set width and height of image to 100
      const commonContext = canvas.getContext("2d");
      //best quality
      commonContext!.imageSmoothingEnabled = true;
      commonContext!.imageSmoothingQuality = "high";

      build(commonContext!, [
        { type: "background", rect: backgroundOptions },
        { type: "grid", grid: gridOptions },
        { type: "blob", blob: blobOptions },
      ]);
    }
  }, [canvas]);
  const generate = useCallback(() => {
    generateImages();
  }, [generateImages]);

  useEffect(() => {
    if (canvasRef.current) {
      setCanvas(canvasRef?.current);
    }
  }, [canvasRef]);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <canvas aria-label="canvas-label" ref={canvasRef}>
        <p>Can not display canvas.</p>
      </canvas>
      <br></br>
      <button onClick={() => generate()} style={{ padding: "1em" }}>
        Generate
      </button>
    </div>
  );
};

export default Director;
