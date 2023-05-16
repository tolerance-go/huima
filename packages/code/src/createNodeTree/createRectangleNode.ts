import { generateBackgroundImageCSS } from "../generateBackgroundImageCSS";
import { getPaintColor } from "../getPaintColor";
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
    "border-radius": (node.cornerRadius as number) + "px",
    "background-color": getPaintColor(node.fills),
    ...(await generateBackgroundImageCSS(node.fills)),
  };

  return {
    nodeInfo,
    tag,
    style,
    children,
  };
};
