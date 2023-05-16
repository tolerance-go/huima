import { getPaintColor } from "../getPaintColor";
import { CSSStyle, NodeInfo, NodeTree } from "../type";

export const createTextNode = async (
  node: TextNode,
  baseStyle: CSSStyle,
  nodeInfo: NodeInfo,
  children: NodeTree[]
): Promise<NodeTree> => {
  console.log("createTextNode", node);
  const color = getPaintColor(node.fills);

  let tag = "span";
  let textContent = node.characters;
  let style = {
    ...baseStyle,
    "font-size": String(node.fontSize) + "px",
    color,
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
