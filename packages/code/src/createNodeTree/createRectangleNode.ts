import { getPaintColor } from "../getPaintColor";
import { CSSStyle, NodeTree } from "../type";
import { generateBackgroundImage } from "../generateBackgroundImage";
import merge from "lodash.merge";

export const createRectangleNode = async (
  node: RectangleNode,
  baseStyle: CSSStyle,
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
