import { NodeInfo } from '@huima/types'

export const getBaseLayoutCSS = (
   node: SceneNode,
   nodeInfo: NodeInfo,
   level = 0,
) => {
   if (level === 0) {
      return {
         position: 'relative',
      }
   }

   if (
      node.parent &&
      'layoutMode' in node.parent &&
      node.parent.layoutMode !== 'NONE' &&
      'layoutPositioning' in node &&
      node.layoutPositioning !== 'ABSOLUTE'
   ) {
      return {
         position: 'relative',
      }
   }

   return {
      position: 'absolute',
      left: nodeInfo.x + 'px',
      top: nodeInfo.y + 'px',
   }
}
