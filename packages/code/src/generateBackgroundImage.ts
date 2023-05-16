import { CSSStyle, NodeTree } from "./type";
import { Buffer } from "buffer";

export async function generateBackgroundImage(
  paints: ReadonlyArray<Paint> | symbol
): Promise<Pick<NodeTree, "style" | "styleMeta">> {
  let bgImageString = "";
  let backgroundImageBuffer: Buffer | undefined;

  if (!Array.isArray(paints) || !paints.length) {
    return {
      style: {},
    };
  }

  for (const paint of paints) {
    console.log("paint", paint);
    if (paint.type === "IMAGE" && paint.imageHash) {
      const image = figma.getImageByHash(paint.imageHash);
      if (image) {
        const bytes = await image.getBytesAsync();
        const buffer = Buffer.from(bytes);
        backgroundImageBuffer = buffer;
      }

      bgImageString += `url('$url')`;

      if (paint.scaleMode) {
        bgImageString += ` ${paint.scaleMode}`;
      }

      if (paint.scalingFactor) {
        bgImageString += ` ${paint.scalingFactor / 100}%`;
      }

      if (paint.visible !== undefined && !paint.visible) {
        bgImageString += ` no-repeat fixed #000`;
      } else {
        bgImageString += ` no-repeat`;
      }
    }
  }

  return {
    style: {
      "background-image": bgImageString,
    },
    styleMeta: {
      backgroundImageBuffer,
    },
  };
}
