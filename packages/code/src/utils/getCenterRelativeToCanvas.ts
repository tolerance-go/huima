import { Point } from '@huima/types'

export function getCenterRelativeToCanvas(absoluteBoundingBox: Rect): Point {
   return {
      x: absoluteBoundingBox.x + absoluteBoundingBox.width / 2,
      y: absoluteBoundingBox.y + absoluteBoundingBox.height / 2,
   }
}
