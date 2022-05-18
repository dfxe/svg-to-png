import React, { useEffect, useState, useRef, useCallback } from "react";
//@ts-ignore
import blobshape from "blobshape";

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

      //maybe wait a bit before generating background
      //generateBackground(commonContext!, 400, 400);
      /* drawGrid(
        ["/cc.svg", "/cc.svg"],
        { width: 400, height: 400 },
        { rows: 3, cols: 7 },
        50,
        10,
        commonContext!
      ); */

      const blobPath = new Path2D(
        blobshape({
          size: 100,
          grow: 0.5,
          edges: 6,
          seed: Math.random() * 1000,
        }).path
      );
      //for moving purposes
      let m = new DOMMatrix();
      m.a = 1;
      m.b = 0;
      m.c = 0;
      m.d = 1;
      m.e = 200;
      m.f = 0;
      blobPath.addPath(blobPath, m);
      //add gradient to blob
      const gradient = commonContext!.createLinearGradient(0, 0, 100, 100);
      gradient.addColorStop(0, "white");
      gradient.addColorStop(1, "blue");
      commonContext!.fillStyle = gradient;
      //draw at random location

      commonContext?.fill(blobPath);

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
}

export default BlobCanvas;
