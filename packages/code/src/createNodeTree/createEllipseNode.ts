import { generateBorderCSS } from "../css-converts/generateBorderCSS";
import { getBackgroundColorCSS } from "../css-converts/getBackgroundColorCSS";
import { CSSStyle, NodeInfo, NodeTree } from "../type";

export const createEllipseNode = async (
  node: EllipseNode,
  baseStyle: CSSStyle,
  nodeInfo: NodeInfo,
  children: NodeTree[]
): Promise<NodeTree> => {
  console.log("createEllipseNode", node);

  let tag = "div";
  let style = {
    ...baseStyle,
    width: node.width + "px",
    height: node.height + "px",
    ...getBackgroundColorCSS(node.fills),
    ...generateBorderCSS(node),
    "border-radius": "100%",
  };

  return {
    nodeInfo,
    tag,
    style,
    children,
  };
};
