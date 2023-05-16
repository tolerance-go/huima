import { generateBackgroundImageCSS } from "../generateBackgroundImageCSS";
import { generateBorderCSS } from "../generateBorderCSS";
import { generateFlexLayoutCSS } from "../generateFlexLayoutCSS";
import { getPaintColor } from "../getPaintColor";
import { CSSStyle, FrameNodeRuntime, NodeInfo, NodeTree } from "../type";

export const createEllipseNode = async (
  node: EllipseNode,
  baseStyle: CSSStyle,
  nodeInfo: NodeInfo,
  children: NodeTree[]
): Promise<NodeTree> => {
  console.log("createEllipseNode", node);
  let backgroundColor = getPaintColor(node.fills);

  let tag = "div";
  let style = {
    ...baseStyle,
    width: node.width + "px",
    height: node.height + "px",
    "border-radius": (node.cornerRadius as number) + "px",
    "background-color": backgroundColor,
  };

  return {
    nodeInfo,
    tag,
    style,
    children,
  };
};
