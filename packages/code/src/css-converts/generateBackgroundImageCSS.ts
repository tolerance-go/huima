import { Buffer } from "buffer";
import { CSSStyle } from "../type";

export async function generateBackgroundImageCSS(
  paints: Paint[]
): Promise<CSSStyle> {
  let style: CSSStyle = {};

  if (!Array.isArray(paints) || !paints.length) {
    return style;
  }

  //NOTE - 注意是倒序
  const paint = [...paints]
    .reverse()
    .find(
      (item) => item.visible && item.type === "IMAGE" && item.imageHash
    ) as ImagePaint;

  if (paint?.imageHash) {
    const image = figma.getImageByHash(paint.imageHash);
    if (image) {
      const bytes = await image.getBytesAsync();
      const buffer = Buffer.from(bytes);

      const base64Image = buffer.toString("base64");

      style["background-image"] = `url('data:image/png;base64,${base64Image}')`;
      style["background-size"] = "cover";
      style["background-repeat"] = "no-repeat";
      style["background-position"] = "center";
    }
  }

  return style;
}
