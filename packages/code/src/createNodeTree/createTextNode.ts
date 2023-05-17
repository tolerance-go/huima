import { getFillSolidColor } from "../getFillSolidColor";
import { CSSStyle, NodeInfo, NodeTree } from "../type";

export const createTextNode = async (
  node: TextNode,
  baseStyle: CSSStyle,
  nodeInfo: NodeInfo,
  children: NodeTree[]
): Promise<NodeTree> => {
  console.log("createTextNode", node);

  let tag = "span";
  let textContent = node.characters;
  let style = {
    ...baseStyle,
    "font-size": String(node.fontSize) + "px",
    color: getFillSolidColor(node.fills),
    display: "inline-block",
  };

  return {
    nodeInfo,
    tag,
    style,
    children,
    textContent,
  };
};
