import { generateBackgroundImageCSS } from "../generateBackgroundImageCSS";
import { generateBorderCSS } from "../generateBorderCSS";
import { generateFlexLayoutCSS } from "../generateFlexLayoutCSS";
import { generateOverflowCSS } from "../generateOverflowCSS";
import { getBackgroundColorCSS } from "../getBackgroundColorCSS";
import { CSSStyle, NodeInfo, NodeTree } from "../type";

export const createFrameNode = async (
  node: FrameNode,
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
    ...getBackgroundColorCSS(node.fills),
    ...generateOverflowCSS(node),
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
