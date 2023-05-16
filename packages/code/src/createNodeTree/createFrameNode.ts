import { generateBackgroundImageCSS } from "../generateBackgroundImageCSS";
import { generateBorderCSS } from "../generateBorderCSS";
import { generateFlexLayoutCSS } from "../generateFlexLayoutCSS";
import { getPaintColor } from "../getPaintColor";
import { CSSStyle, FrameNodeRuntime, NodeInfo, NodeTree } from "../type";

export const createFrameNode = async (
  node: FrameNodeRuntime,
  baseStyle: CSSStyle,
  nodeInfo: NodeInfo,
  children: NodeTree[]
): Promise<NodeTree> => {
  console.log("createFrameNode", node);

  let tag = "div";
  let style = {
    ...baseStyle,
    width: node.width + "px",
    height: node.height + "px",
    "background-color": getPaintColor(node.fills),
    "border-radius": String(node.cornerRadius) + "px",
    ...generateFlexLayoutCSS(node),
    ...generateBorderCSS(node),
    ...(await generateBackgroundImageCSS(node.fills)),
  };

  return {
    nodeInfo,
    tag,
    style,
    children,
  };
};
