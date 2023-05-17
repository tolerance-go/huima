import { CSSStyle, NodeInfo, NodeTree } from "../type";

export const createVectorNode = async (
  node: VectorNode | BooleanOperationNode,
  baseStyle: CSSStyle,
  nodeInfo: NodeInfo,
  children: NodeTree[]
): Promise<NodeTree> => {
  console.log("createVectorNode", node);

  // NOTE - 隐藏的元素导出会报错
  const svgStr = nodeInfo.parentsVisible
    ? await node.exportAsync({ format: "SVG_STRING" })
    : undefined;

  let tag = "svg";
  let style = {
    ...baseStyle,
    width: node.width + "px",
    height: node.height + "px",
  };

  return {
    nodeInfo,
    tag,
    style,
    children,
    element: svgStr,
  };
};
