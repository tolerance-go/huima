import { NodeInfo } from '@huima/types'

export const getBaseNodeInfo = (
   sceneNode: SceneNode,
   visible: boolean,
   level = 0,
) => {
   const nodeInfo: NodeInfo = {
      type: sceneNode.type,
      x: sceneNode.x,
      y: sceneNode.y,
      visible: sceneNode.visible,
      parentsVisible: visible,
      level,
   }

   return nodeInfo
}
