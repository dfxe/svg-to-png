//@ts-ignore
import blobshape from "blobshape";
import { saveAs } from "file-saver";
/**
 * Draws text onto the canvas
 * @param ctx - The canvas context to draw on
 * @param x - The x coordinate of the top left corner of the rectangle
 * @param y - The y coordinate of the top left corner of the rectangle
 * @param text - The text to draw
 * @param font - The font to use
 * @param color - The color to draw the text in
 */
export interface TextOptions {
  x: number;
  y: number;
  text: string;
  font: string;
  fontSize: number;
  color: string;
}
const drawText = ({
  ctx,
  options: { x, y, text, font, fontSize, color },
}: {
  ctx: CanvasRenderingContext2D;
  options: TextOptions;
}) => {
  ctx.font = `${fontSize}px ${font}`;
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
};

/**
 * Fills the canvas, fully width and height, with the given color gradient
 * @remarks
 * This method is part of the RenderingFunctions interface
 * @param ctx - The canvas context to draw on
 * @param gradientType - The gradient to use: linear, radial, or conic
 * @param colors - color array for the gradient
 * @beta
 */
const drawGradient = (
  ctx: CanvasRenderingContext2D,
  gradientType: string,
  colors: string[]
) => {
  if (gradientType === "linear") {
    const gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(1, colors[1]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  } else if (gradientType === "radial") {
    const gradient = ctx.createRadialGradient(
      ctx.canvas.width / 2,
      ctx.canvas.height / 2,
      0,
      ctx.canvas.width / 2,
      ctx.canvas.height / 2,
      ctx.canvas.width / 2
    );
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(1, colors[1]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  } else if (gradientType === "conic") {
    const gradient = ctx.createConicGradient(
      ctx.canvas.width / 2,
      ctx.canvas.height / 2,
      0
    );
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(1, colors[1]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  } else {
    throw new Error("Invalid gradient type");
  }
};
/**
 * Generates a rectangle with the given dimensions and color
 * @param ctx - The canvas context to draw on
 * @param x - The x coordinate of the top left corner of the rectangle
 * @param y - The y coordinate of the top left corner of the rectangle
 * @param width - The width of the rectangle
 * @param height - The height of the rectangle
 * @param radius - The radius of the corners of the rectangle
 * @param fill - The color to fill the rectangle with
 * @param stroke - The color to stroke the rectangle with
 */
export interface RectangleOptions {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
  fill: string;
  stroke: boolean;
}
const drawBackground = ({
  ctx,
  options: { x, y, width, height, radius, fill, stroke },
}: {
  ctx: CanvasRenderingContext2D;
  options: RectangleOptions;
}) => {
  const radiusDimensions = {
    tl: radius,
    tr: radius,
    br: radius,
    bl: radius,
  } || { tl: 0, tr: 0, br: 0, bl: 0 };

  //TODO: test this
  ctx!.fillStyle = fill;

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
  ctx.quadraticCurveTo(x, y + height, x, y + height - radiusDimensions.bl);
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

/**
 * Generates a shape with the given dimensions and color
 * @remarks
 * Currently tested only on svgs
 * @param shapePath - The path to the shape to be drawn, can be found in public or images folder
 * @param ctx - The canvas context to draw on
 * @param shapeDimensions - The dimensions of the shape
 */
const drawShape = (
  shapePath: string,
  ctx: CanvasRenderingContext2D,
  shapeDimensions: { x: number; y: number; width: number; height: number }
) => {
  const shapeX: HTMLImageElement = new Image();
  shapeX.src = shapePath;
  shapeX.onload = () => {
    //img, x, y, width, height
    ctx.drawImage(
      shapeX,
      shapeDimensions.x,
      shapeDimensions.y,
      shapeDimensions.width,
      shapeDimensions.height
    );
  };
};

/**
 * Draws a grid of the images (currently svgs) on the canvas
 * @param pathsToDrawFrom - The paths (urls) to draw from
 * @param canvasDimensions - The dimensions of the canvas
 * @param gridDimensions - The dimensions of the grid
 * @param ctx - The canvas context to draw on
 */
export interface GridOptions {
  pathsToDrawFrom: string[];
  canvasDimensions: { width: number; height: number };
  gridDimensions: {
    rows: number;
    cols: number;
    cellSize: { width: number; height: number };
    gridGap: number;
    padding: number;
  };
}

const drawGrid = ({
  ctx,
  options: { pathsToDrawFrom, canvasDimensions, gridDimensions },
}: {
  ctx: CanvasRenderingContext2D;
  options: GridOptions;
}) => {
  const gridWidth = canvasDimensions.width / gridDimensions.cols;
  const gridHeight = canvasDimensions.height / gridDimensions.rows;
  const gridGapWidth = gridWidth + gridDimensions.gridGap;
  const gridGapHeight = gridHeight + gridDimensions.gridGap;
  //padding should act as a buffer around the grid
  const gridX = gridDimensions.padding;
  const gridY = gridDimensions.padding;
  const gridWidthWithPadding = gridWidth - gridDimensions.padding * 2;
  const gridHeightWithPadding = gridHeight - gridDimensions.padding * 2;
  const gridGapWidthWithPadding = gridGapWidth - gridDimensions.padding * 2;
  const gridGapHeightWithPadding = gridGapHeight - gridDimensions.padding * 2;
  //auto width and height
  const autoWidth = gridWidth / pathsToDrawFrom.length;
  const autoHeight = gridHeight / pathsToDrawFrom.length;
  for (let i = 0; i < gridDimensions.rows; i++) {
    for (let j = 0; j < gridDimensions.cols; j++) {
      drawShape(pathsToDrawFrom[0], ctx, {
        x: j * gridWidth,
        y: i * gridHeight,
        width: gridDimensions.cellSize.width,
        height: gridDimensions.cellSize.height,
      });
    }
  }
};

/**
 * Draws one or more curved polygons, often referred to as a blobs
 * @param ctx - The canvas context to draw on
 */
export interface BlobOptions {
  numOfPolygons: number;
  polygonDimensions: {
    size: number;
    grow: number;
    edges: number;
    seed: number;
  };
}
const drawBlobs = ({
  ctx,
  options: { numOfPolygons, polygonDimensions },
}: {
  ctx: CanvasRenderingContext2D;
  options: BlobOptions;
}) => {
  for (let i = 0; i < numOfPolygons; i++) {
    const blobPath = new Path2D(
      blobshape({
        size: polygonDimensions.size,
        grow: polygonDimensions.grow,
        edges: polygonDimensions.edges,
        seed: polygonDimensions.seed,
      }).path
    );
    //for moving purposes
    /* let m = new DOMMatrix();
    m.a = 1;
    m.b = 0;
    m.c = 0;
    m.d = 1;
    m.e = 200;
    m.f = 0;
    blobPath.addPath(blobPath, m); */

    ctx?.fill(blobPath);
  }
};

/**
 *
 * @param canvas - The canvas to draw on
 *
 * @returns - The canvas as a HTMLImageElement
 */
const saveCanvasToImage = (canvas: HTMLCanvasElement) => {
  const image = new Image();
  image.src = canvas.toDataURL("image/png");
  return image;
};

/**
 * Saves the canvas to a file
 * @param canvas - The canvas to draw on
 */
const saveCanvasToBlob = (canvas: HTMLCanvasElement) => {
  canvas!.toBlob((blob) => {
    if (blob) {
      saveAs(blob, `${Math.random().toString(16).slice(2, -1)}.png`);
    }
  });
};

/**
 * Clears the canvas
 * @param ctx - The canvas context to draw on
 */
const clearCanvas = (ctx: CanvasRenderingContext2D) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};
//@ts-ignore
const isTypeRectangleOptions = (shape: any): shape is RectangleOptions => {
  return (shape as RectangleOptions) !== undefined;
};
const isTypeGridOptions = (shape: any): shape is GridOptions => {
  return (shape as GridOptions) !== undefined;
};
const isTypeBlobOptions = (shape: any): shape is BlobOptions => {
  return (shape as BlobOptions) !== undefined;
};
const isTypeTextOptions = (shape: any): shape is TextOptions => {
  return (shape as TextOptions) !== undefined;
};
interface DrawObject {
  type: string;
  rect?: RectangleOptions;
  grid?: GridOptions;
  blob?: BlobOptions;
  text?: TextOptions;
}

/**
 *
 * @param ctx - The canvas context to draw on
 * @param drawables - The objects to draw on the canvas
 */
export const build = (
  ctx: CanvasRenderingContext2D,
  drawables: DrawObject[]
) => {
  if (drawables.length > 0) {
    clearCanvas(ctx);
    for (let i = 0; i < drawables.length; i++) {
      if (drawables[i].type === "background") {
        isTypeRectangleOptions(drawables[i].rect) &&
          drawBackground({ ctx: ctx, options: drawables[i].rect! });
      } else if (drawables[i].type === "grid") {
        isTypeGridOptions(drawables[i].grid) &&
          drawGrid({ ctx: ctx, options: drawables[i].grid! });
      } else if (drawables[i].type === "blob") {
        isTypeBlobOptions(drawables[i].blob) &&
          drawBlobs({ ctx: ctx, options: drawables[i].blob! });
      } else if (drawables[i].type === "text") {
        isTypeTextOptions(drawables[i].text) &&
          drawText({ ctx: ctx, options: drawables[i].text! });
      }
    }
  } else {
    throw new Error("No objects to draw");
  }
};
