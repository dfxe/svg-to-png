import blobshape from "https://esm.sh/blobshape@1.0.0";

const drawText = (ctx, { x, y, text, font, fontSize, color }) => {
  ctx.font = `${fontSize}px ${font}`;
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
};

const drawGradient = (ctx, opts) => {
  const { x, y, width, height, gradientType, colors } = opts;
  let gradient;
  if (gradientType === "linear") {
    gradient = ctx.createLinearGradient(0, 0, width, 0);
  } else if (gradientType === "radial") {
    gradient = ctx.createRadialGradient(
      width / 2, height / 2, 0,
      width / 2, height / 2, width / 2,
    );
  } else if (gradientType === "conic") {
    gradient = ctx.createConicGradient(30, width / 2, height / 2);
  } else {
    throw new Error("Invalid gradient type");
  }
  gradient.addColorStop(0, colors[0]);
  gradient.addColorStop(1, colors[1]);
  ctx.fillStyle = gradient;
  ctx.fillRect(x, y, width, height);
};

const drawBackground = (ctx, { x, y, width, height, radius, fill, stroke }) => {
  const r = { tl: radius, tr: radius, br: radius, bl: radius };
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(x + r.tl, y);
  ctx.lineTo(x + width - r.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r.tr);
  ctx.lineTo(x + width, y + height - r.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r.br, y + height);
  ctx.lineTo(x + r.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r.bl);
  ctx.lineTo(x, y + r.tl);
  ctx.quadraticCurveTo(x, y, x + r.tl, y);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
};

const drawShape = (ctx, shapePath, { x, y, width, height }) => {
  const img = new Image();
  img.src = shapePath;
  img.onload = () => ctx.drawImage(img, x, y, width, height);
};

const drawGrid = (ctx, { pathsToDrawFrom, canvasDimensions, gridDimensions }) => {
  const gridWidth = canvasDimensions.width / gridDimensions.cols;
  const gridHeight = canvasDimensions.height / gridDimensions.rows;
  for (let i = 0; i < gridDimensions.rows; i++) {
    for (let j = 0; j < gridDimensions.cols; j++) {
      drawShape(ctx, pathsToDrawFrom[0], {
        x: j * gridWidth,
        y: i * gridHeight,
        width: gridDimensions.cellSize.width,
        height: gridDimensions.cellSize.height,
      });
    }
  }
};

const drawBlobs = (ctx, { numOfPolygons, polygonDimensions }) => {
  for (let i = 0; i < numOfPolygons; i++) {
    const { path } = blobshape({
      size: polygonDimensions.size,
      grow: polygonDimensions.grow,
      edges: polygonDimensions.edges,
      seed: polygonDimensions.seed,
    });
    ctx.fill(new Path2D(path));
  }
};

const clearCanvas = (ctx) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};

const build = (ctx, drawables) => {
  if (!drawables.length) throw new Error("No objects to draw");
  clearCanvas(ctx);
  for (const d of drawables) {
    if (d.rect) drawBackground(ctx, d.rect);
    if (d.grid) drawGrid(ctx, d.grid);
    if (d.blob) drawBlobs(ctx, d.blob);
    if (d.text) drawText(ctx, d.text);
    if (d.gradient) drawGradient(ctx, d.gradient);
  }
};

const saveCanvasToBlob = (canvas) => {
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${Math.random().toString(16).slice(2, -1)}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });
};

const backgroundOptions = {
  x: 5, y: 5, width: 100, height: 40, radius: 20, fill: "#ff4785", stroke: false,
};
const gradientOptions = {
  x: 5, y: 5, width: 100, height: 40, radius: 20, fill: "#ff4785", stroke: false,
  gradientType: "radial", colors: ["#ff4785", "#3d59be"],
};
const gridOptions = {
  pathsToDrawFrom: ["cc.svg"],
  canvasDimensions: { width: 400, height: 440 },
  gridDimensions: {
    rows: 5, cols: 5,
    cellSize: { width: 50, height: 50 },
    gridGap: 5, padding: 5,
  },
};
const blobOptions = {
  numOfPolygons: 2,
  polygonDimensions: { size: 100, grow: 4, edges: 3, seed: Math.random() },
};
const textOptions = {
  x: 5, y: 50, text: "Hello World", font: "Arial", fontSize: 50, color: "black",
};

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = "high";

const generate = () => {
  build(ctx, [
    { rect: backgroundOptions },
    { grid: gridOptions },
    { blob: blobOptions },
    { text: textOptions },
    { gradient: gradientOptions },
  ]);
};

document.getElementById("generate").addEventListener("click", generate);

document.getElementById("save").addEventListener("click", () => {
  saveCanvasToBlob(canvas);
});

let uploadedUrl = null;
document.getElementById("svg-upload").addEventListener("change", (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  if (uploadedUrl) URL.revokeObjectURL(uploadedUrl);
  uploadedUrl = URL.createObjectURL(file);
  gridOptions.pathsToDrawFrom = [uploadedUrl];
  generate();
});
