import { NodeInfo } from "@huima/types";

export const getBaseNodeInfo = (sceneNode: SceneNode, level = 0) => {
  const nodeInfo: NodeInfo = {
    type: sceneNode.type,
    x: sceneNode.x,
    y: sceneNode.y,
  };

  if (level === 0) {
    nodeInfo.x = 0;
    nodeInfo.y = 0;
    return nodeInfo;
  }

  return nodeInfo;
};
