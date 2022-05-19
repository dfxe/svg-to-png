import React, { useEffect, useState, useRef, useCallback } from "react";
import { drawBlobs } from "./RenderingFunctions/RenderingFunctions";

function BlobCanvas() {
  const [canvas, setCanvas] = useState<HTMLCanvasElement>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
}

export default BlobCanvas;
