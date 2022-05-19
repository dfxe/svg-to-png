import React, { useEffect, useState, useRef, useCallback } from "react";

type Props = {
  children: React.ReactNode;
};
const BackgroundCanvas = ({ children }: Props) => {
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

      const roundBackground = (
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        width: number,
        height: number,
        radius: number,
        fill: string,
        stroke: boolean
      ) => {
        const radiusDimensions = {
          tl: radius,
          tr: radius,
          br: radius,
          bl: radius,
        } || { tl: 0, tr: 0, br: 0, bl: 0 };

        ctx.beginPath();
        ctx.moveTo(x + radiusDimensions.tl, y);
        ctx.lineTo(x + width - radiusDimensions.tr, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radiusDimensions.tr);
        ctx.lineTo(x + width, y + height - radiusDimensions.br);
        ctx.quadraticCurveTo(
          x + width,
          y + height,
          x + width - radiusDimensions.br,
          y + height
        );
        ctx.lineTo(x + radiusDimensions.bl, y + height);
        ctx.quadraticCurveTo(
          x,
          y + height,
          x,
          y + height - radiusDimensions.bl
        );
        ctx.lineTo(x, y + radiusDimensions.tl);
        ctx.quadraticCurveTo(x, y, x + radiusDimensions.tl, y);
        ctx.closePath();
        if (fill) {
          ctx.fill();
        }
        if (stroke) {
          ctx.stroke();
        }
      };

      //ctx!.strokeStyle = "rgb(255, 0, 0)";
      ctx!.fillStyle = "rgba(255, 255, 0, 1)";
      roundBackground(
        ctx!,
        5,
        5,
        Math.random() * 100 + 200,
        100,
        20,
        "blue",
        true
      );
    }
  }, [canvas]);

  const generate = useCallback(() => {
    canvas?.getContext("2d")?.clearRect(0, 0, canvas!.width, canvas!.height);
    generateImages();
  }, [generateImages]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
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

export default BackgroundCanvas;
