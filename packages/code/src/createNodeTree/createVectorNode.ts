import { getPaintColor } from "../getPaintColor";
import { CSSStyle, NodeInfo, NodeTree } from "../type";

export const createVectorNode = async (
  node: VectorNode,
  baseStyle: CSSStyle,
  nodeInfo: NodeInfo,
  children: NodeTree[]
): Promise<NodeTree> => {
  console.log("createVectorNode", node);
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
