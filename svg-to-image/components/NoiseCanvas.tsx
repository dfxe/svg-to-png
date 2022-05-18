import React, { useEffect, useState, useRef, useCallback } from "react";

function NoiseCanvas() {
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
      const ctx = canvas.getContext("2d");
      //best quality
      ctx!.imageSmoothingEnabled = true;
      ctx!.imageSmoothingQuality = "high";
      const roundRect = (ctx, x, y, width, height, radius, fill, stroke) => {
        if (typeof stroke === "undefined") {
          stroke = true;
        }
        if (typeof radius === "undefined") {
          radius = 5;
        }
        if (typeof radius === "number") {
          radius = { tl: radius, tr: radius, br: radius, bl: radius };
        } else {
          var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
          for (var side in defaultRadius) {
            radius[side] = radius[side] || defaultRadius[side];
          }
        }
        ctx.beginPath();
        ctx.moveTo(x + radius.tl, y);
        ctx.lineTo(x + width - radius.tr, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
        ctx.lineTo(x + width, y + height - radius.br);
        ctx.quadraticCurveTo(
          x + width,
          y + height,
          x + width - radius.br,
          y + height
        );
        ctx.lineTo(x + radius.bl, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
        ctx.lineTo(x, y + radius.tl);
        ctx.quadraticCurveTo(x, y, x + radius.tl, y);
        ctx.closePath();
        if (fill) {
          ctx.fill();
        }
        if (stroke) {
          ctx.stroke();
        }
      };
      roundRect(ctx, 5, 5, 50, 50);
      // To change the color on the rectangle, just manipulate the context
      ctx!.strokeStyle = "rgb(255, 0, 0)";
      ctx!.fillStyle = "rgba(255, 255, 0, .5)";
      roundRect(ctx, 100, 5, 100, 100, 20, true);
      // Manipulate it again
      ctx!.strokeStyle = "#0f0";
      ctx!.fillStyle = "#ddd";
      // Different radii for each corner, others default to 0
      roundRect(
        ctx,
        300,
        5,
        200,
        100,
        {
          tl: 50,
          br: 25,
        },
        true
      );
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

export default NoiseCanvas;
