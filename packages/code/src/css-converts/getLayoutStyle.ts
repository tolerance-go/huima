import { computeOriginalCoordinates } from '../utils/computeOriginalCoordinates'
import { getCenterRelativeToParent } from '../utils/getCenterRelativeToParent'

export const getLayoutStyle = (node: SceneNode, level = 0) => {
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

   if (
      'rotation' in node &&
      node.rotation &&
      node.type !== 'LINE' &&
      // 箭头不支持旋转
      node.type !== 'VECTOR'
   ) {
      if (!node.absoluteBoundingBox) {
         throw new Error('node.absoluteBoundingBox is undefined')
      }

      // 如果 parent 是 document 或者 PageNode 则返回空，否则返回 parent 的 absoluteBoundingBox
      const parentAbsoluteBoundingBox =
         node.parent?.type === 'DOCUMENT' || node.parent?.type === 'PAGE'
            ? undefined
            : node.parent?.absoluteBoundingBox

      // 计算旋转中心
      const center = getCenterRelativeToParent(
         node.absoluteBoundingBox,
         parentAbsoluteBoundingBox,
      )

      const { x, y } = computeOriginalCoordinates(
         {
            x: node.x,
            y: node.y,
         },
         -node.rotation,
         center,
      )
      return {
         position: 'absolute',
         left: x + 'px',
         top: y + 'px',
      }
   }

   return {
      position: 'absolute',
      left: node.x + 'px',
      top: node.y + 'px',
   }
}
