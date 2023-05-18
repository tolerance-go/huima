import { NodeInfo } from '@huima/types'
import { isJsDesign } from './pluginApi'
import { filterObjFuncAndSymbol } from './utils/filterObjFuncAndSymbol'

export const getBaseNodeInfo = (
   sceneNode: SceneNode,
   parentNodeInfo: NodeInfo | undefined = undefined,
   visible: boolean,
   level = 0,
) => {
   const { parent, ...rest } = filterObjFuncAndSymbol(
      sceneNode,
      isJsDesign
         ? [
              // 即时设计还没有支持，取值会报错
              'strokeMiterLimit',
              'paragraphIndent',
              'documentationLinks',
           ]
         : [],
   )

   const nodeInfo: NodeInfo = {
      ...rest,
      parentsVisible: visible,
      level,
      parentNodeInfo,
   }

   return nodeInfo
}
