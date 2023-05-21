import { Point } from '@huima/types'
import { getCenterRelativeToCanvas } from './getCenterRelativeToCanvas'

export function getCenterRelativeToParent(
   boundingBox: Rect,
   parentAbsoluteBoundingBox?: Rect | null,
): Point {
   const centerRelativeToCanvas = getCenterRelativeToCanvas(boundingBox)

   if (!parentAbsoluteBoundingBox) {
      return centerRelativeToCanvas
   }

   // 父节点的中心点坐标
   const parentCenter = getCenterRelativeToCanvas(parentAbsoluteBoundingBox)
   // 相对于父节点的中心点坐标
   return {
      x:
         centerRelativeToCanvas.x -
         parentCenter.x +
         parentAbsoluteBoundingBox.width / 2,
      y:
         centerRelativeToCanvas.y -
         parentCenter.y +
         parentAbsoluteBoundingBox.height / 2,
   }
}
