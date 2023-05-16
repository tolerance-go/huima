import merge from "lodash.merge";
import { generateBackgroundImage } from "../generateBackgroundImage";
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
    "background-color": getPaintColor(node.backgrounds),
    "border-radius": node.cornerRadius + "px",
    ...generateFlexLayoutCSS(node),
    ...generateBorderCSS(node),
  };

  return merge(
    {
      tag,
      style,
      children,
    },
    await generateBackgroundImage(node.fills)
  );
};
