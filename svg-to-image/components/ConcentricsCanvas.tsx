import React, { useEffect, useState, useRef, useCallback } from "react";

function ConcentricsCanvas() {
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

      //draw concentric circles
      const gradient = commonContext!.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2
      );
      gradient.addColorStop(0, "rgba(255,255,255,0)");
      gradient.addColorStop(1, "rgba(255,255,255,1)");

      commonContext!.fillStyle = gradient;
      commonContext!.fillRect(0, 0, canvas.width, canvas.height);
      //draw concentric circles
      const gradient2 = commonContext!.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2
      );
      gradient2.addColorStop(0, "rgba(0,0,0,0)");
      gradient2.addColorStop(1, "rgba(0,0,0,1)");
      commonContext!.fillStyle = gradient2;
      commonContext!.fillRect(0, 0, canvas.width, canvas.height);

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

      //round corners here

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

export default ConcentricsCanvas;
