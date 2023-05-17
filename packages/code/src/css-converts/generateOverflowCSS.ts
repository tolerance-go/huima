import { CSSStyle } from "../type";

export function generateOverflowCSS(
  node: Pick<FrameNode, "clipsContent">
): CSSStyle {
  let cssProps: CSSStyle = {
    overflow: node.clipsContent ? "hidden" : undefined,
  };

  return cssProps;
}
