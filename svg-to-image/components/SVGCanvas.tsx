import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  generateBackground,
  drawGrid,
} from "./RenderingFunctions/RenderingFunctions";
const SVGtoPNG = () => {
  const [canvas, setCanvas] = useState<HTMLCanvasElement>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  //background
  /* const generateBackground = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    //draw background with gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#fdfbfb");
    gradient.addColorStop(1, "red");
    ctx.fillStyle = gradient;
    //ctx.fillRect(0, 0, width, height);
    //draw background with radial gradient
    /* const gradient2 = ctx.createRadialGradient(
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
    /* gradient.addColorStop(0, "red");
    gradient.addColorStop(0.25, "orange");
    gradient.addColorStop(0.5, "yellow");
    gradient.addColorStop(0.75, "green");
    gradient.addColorStop(1, "blue"); 

    
    // Set the fill style and draw a rectangle
    //ctx.fillStyle = gradient3;
    //ctx.fillRect(0, 0, width, height);
  }; */
  //shapes

  // grid drawing utilities

  useEffect(() => {
    if (canvasRef.current) {
      setCanvas(canvasRef?.current);
    }
  }, [canvasRef]);
  const generateImages = useCallback(() => {
    if (canvas) {
      //set width and height of image to 100
      canvas!.width = 800;
      canvas!.height = 400;
      const commonContext = canvas.getContext("2d");
      //best quality
      commonContext!.imageSmoothingEnabled = true;
      commonContext!.imageSmoothingQuality = "high";

      //maybe wait a bit before generating background
      generateBackground(
        commonContext!,
        5,
        5,
        canvas!.width - 5,
        canvas!.height - 5,
        64,
        "blue",
        true
      );
      drawGrid(
        ["/cc.svg", "/cc.svg"],
        { width: canvas!.width, height: canvas!.height },
        {
          rows: 3,
          cols: 13,
          cellSize: { width: 10, height: 10 },
          gridGap: 1,
          padding: 1,
        },

        commonContext!
      );
      //commonContext!.clearRect(0, 0, 400, 400);
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
    canvas?.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
    generateImages();
  }, [generateImages]);

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

export default SVGtoPNG;
