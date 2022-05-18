import React from "react";

type Props = {
  svgStrings: string[];
};
export default function SVGtoPNG({ svgStrings }: Props) {
  const [open, setOpen] = React.useState(false);
  const svgImageRef = React.useRef<HTMLImageElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const outImageRef = React.useRef<HTMLImageElement>(null);
  const [canvasDimensions, setCanvasDimensions] = React.useState({
    width: 500,
    height: 500,
  });
  const [canvasScale, setCanvasScale] = React.useState(1);

  const svgs: string[] = svgStrings;

  const svgUrlToPng = (svgUrl: string) => {
    svgImageRef!.current!.onload = () => {
      const canvasCtx = canvasRef!.current!.getContext("2d");
      canvasCtx!.drawImage(svgImageRef!.current!, 0, 0);

      // This needs be nested in <a id="download_image" href="" download="image.png"></a>
      outImageRef!.current!.src = canvasRef!.current!.toDataURL("image/png");
      outImageRef!.current!.style.transform = `translate(${
        (Math.random() * 500 + 200, Math.random() * 500 + 200)
      },0) scale(${canvasScale / 2})`;
    };
    svgImageRef!.current!.src = svgUrl;
  };
  const getSvgUrl = (svg: string) => {
    return URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
  };

  //FIXME: for this to work, need to add an id to the parent element and access it's child list.
  const svgToPng = (svgStringsToPng: string[]) => {
    for (let i = 0; i < svgStringsToPng.length; i++) {
      svgUrlToPng(getSvgUrl(svgStringsToPng[i]));
    }
  };

  return (
    <>
      <img hidden={false} ref={svgImageRef} />
      <a download="image">
        <img ref={outImageRef} />
      </a>
      <canvas
        ref={canvasRef}
        width={canvasDimensions.width}
        height={canvasDimensions.height}
      ></canvas>
      <button
        onClick={() => {
          svgToPng(svgs);
        }}
      >
        Export PNG
      </button>
    </>
  );
}
