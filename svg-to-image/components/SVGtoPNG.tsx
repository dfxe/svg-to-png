import React, { useEffect } from "react";
import { Canvg } from "canvg";
function SVGtoPNG() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const generateImage = () => {
    //@ts-ignore
    let v = null;

    window.onload = async () => {
      const ctx = canvasRef!.current!.getContext("2d");

      v = await Canvg.from(ctx!, "../images/nice.svg");

      // Start SVG rendering with animations and mouse handling.
      v.start();
    };

    window.onbeforeunload = () => {
      //@ts-ignore
      v!.stop();
    };
  };
  useEffect(() => {
    generateImage();
  }, []);
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
      <button onClick={generateImage} style={{ padding: "1em" }}>
        Generate
      </button>
    </div>
  );
}

export default SVGtoPNG;
