import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  build,
  saveCanvasToBlob,
  RectangleOptions,
  GridOptions,
  BlobOptions,
  TextOptions,
  GradientOptions,
} from "./CanvasBuilder";

const Director = () => {
  const [canvas, setCanvas] = useState<HTMLCanvasElement>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  //React context or compose into a single hook
  const [backgroundOptions, setBackgroundOptions] = useState<RectangleOptions>({
    x: 5,
    y: 5,
    width: 100,
    height: 40,
    radius: 20,
    fill: "red",
    stroke: false,
  });
  const [gradientOptions, setGradientOptions] = useState<GradientOptions>({
    x: 5,
    y: 5,
    width: 100,
    height: 40,
    radius: 20,
    fill: "red",
    stroke: false,
    gradientType: "radial",
    colors: ["white", "black"],
  });
  const [gridOptions, setGridOptions] = useState<GridOptions>({
    pathsToDrawFrom: ["/cc.svg"],
    canvasDimensions: { width: 400, height: 440 },
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
      seed: Math.random(),
    },
  });
  const [textOptions, setTextOptions] = useState<TextOptions>({
    x: 5,
    y: 50,
    text: "Hello World",
    font: "Arial",
    fontSize: 50,
    color: "black",
  });

  const generateImages = useCallback(() => {
    if (canvas) {
      //set width and height of image to 100
      const commonContext = canvas.getContext("2d");
      //best quality
      commonContext!.imageSmoothingEnabled = true;
      commonContext!.imageSmoothingQuality = "high";

      //just plug-in objects you need to create
      build(commonContext!, [
        { rect: backgroundOptions },
        /* { grid: gridOptions },
        { blob: blobOptions },
        { text: textOptions }, */
        { gradient: gradientOptions },
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
    <div style={{ display: "flex", flexDirection: "column" }}>
      <canvas aria-label="canvas-label" ref={canvasRef}>
        <p>Can not display canvas. Browser not supported.</p>
      </canvas>
      <br></br>
      <button onClick={() => generate()} style={{ padding: "1em" }}>
        Generate
      </button>

      <button
        onClick={() => saveCanvasToBlob(canvasRef?.current)}
        style={{ padding: "1em" }}
      >
        Save
      </button>
    </div>
  );
};

export default Director;
