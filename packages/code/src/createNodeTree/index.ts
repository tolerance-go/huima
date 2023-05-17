import { CSSStyle, NodeTree, SceneNodeRuntime } from "../type";
import { createComponentNode } from "./createComponentNode";
import { createEllipseNode } from "./createEllipseNode";
import { createFrameNode } from "./createFrameNode";
import { createGroupNode } from "./createGroupNode";
import { createInstanceNode } from "./createInstanceNode";
import { createRectangleNode } from "./createRectangleNode";
import { createTextNode } from "./createTextNode";
import { createVectorNode } from "./createVectorNode";
import { getBaseLayoutCSS } from "../css-converts/getBaseLayoutCSS";
import { getBaseNodeInfo } from "../css-converts/getBaseNodeInfo";
import { getBaseSizeCSS } from "../css-converts/getBaseSizeCSS";

export async function createNodeTree(
  sceneNode: SceneNodeRuntime,
  level = 0
): Promise<NodeTree> {
  console.log("sceneNode", sceneNode, sceneNode.type);

  const nodeInfo = getBaseNodeInfo(sceneNode, level);

  const baseStyle: CSSStyle = {
    ...getBaseSizeCSS(sceneNode),
    ...getBaseLayoutCSS(nodeInfo, level),
  };

  const children: NodeTree[] =
    "children" in sceneNode
      ? await Promise.all(
          sceneNode.children.map((item) => createNodeTree(item, level + 1))
        )
      : [];

  if (sceneNode.type === "FRAME") {
    return await createFrameNode(sceneNode, baseStyle, nodeInfo, children);
  } else if (sceneNode.type === "GROUP") {
    return createGroupNode(sceneNode, baseStyle, nodeInfo, children);
  } else if (sceneNode.type === "TEXT") {
    return createTextNode(sceneNode, baseStyle, nodeInfo, children);
  } else if (sceneNode.type === "RECTANGLE") {
    return createRectangleNode(sceneNode, baseStyle, nodeInfo, children);
  } else if (sceneNode.type === "VECTOR") {
    return createVectorNode(sceneNode, baseStyle, nodeInfo, children);
  } else if (sceneNode.type === "ELLIPSE") {
    return createEllipseNode(sceneNode, baseStyle, nodeInfo, children);
  } else if (sceneNode.type === "COMPONENT") {
    return createComponentNode(sceneNode, baseStyle, nodeInfo, children);
  } else if (sceneNode.type === "INSTANCE") {
    return createInstanceNode(sceneNode, baseStyle, nodeInfo, children);
  }

  return {
    tag: "",
    nodeInfo,
    style: baseStyle,
    children,
  };
}
