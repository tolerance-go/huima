import { generateBackgroundImageCSS } from "../css-converts/generateBackgroundImageCSS";
import { generateBorderCSS } from "../css-converts/generateBorderCSS";
import { getBackgroundColorCSS } from "../css-converts/getBackgroundColorCSS";
import { CSSStyle, NodeInfo, NodeTree } from "../type";

export const createRectangleNode = async (
  node: RectangleNode,
  baseStyle: CSSStyle,
  nodeInfo: NodeInfo,
  children: NodeTree[]
): Promise<NodeTree> => {
  console.log("createRectangleNode", node);

  let tag = "div";
  let style = {
    ...baseStyle,
    width: node.width + "px",
    height: node.height + "px",
    ...generateBorderCSS(node),
    ...getBackgroundColorCSS(node.fills),
    ...(await generateBackgroundImageCSS(node.fills)),
  };

  return {
    nodeInfo,
    tag,
    style,
    children,
  };
};
