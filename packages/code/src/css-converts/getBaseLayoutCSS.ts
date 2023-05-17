import { NodeInfo } from '@huima/types'

export const getBaseLayoutCSS = (nodeInfo: NodeInfo, level = 0) => {
   if (level === 0) {
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
