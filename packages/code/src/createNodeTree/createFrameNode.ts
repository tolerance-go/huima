import { generateBackgroundImageCSS } from "../generateBackgroundImageCSS";
import { generateBorderCSS } from "../generateBorderCSS";
import { generateFlexLayoutCSS } from "../generateFlexLayoutCSS";
import { getPaintColor } from "../getPaintColor";
import { CSSStyle, FrameNodeRuntime, NodeTree } from "../type";

export const createFrameNode = async (
  node: FrameNodeRuntime,
  baseStyle: CSSStyle,
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
    tag,
    style,
    children,
  };
};
