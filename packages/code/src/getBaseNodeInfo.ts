import { NodeInfo } from '@huima/types'
import { filterObjFuncAndSymbol } from './utils/filterObjFuncAndSymbol'

export const getBaseNodeInfo = (
   sceneNode: SceneNode,
   parentNodeInfo: NodeInfo,
   visible: boolean,
   level = 0,
) => {
   const { parent, ...rest } = filterObjFuncAndSymbol(sceneNode)

   const nodeInfo: NodeInfo = {
      ...rest,
      parentsVisible: visible,
      level,
      parentNodeInfo,
   }

   return nodeInfo
}
