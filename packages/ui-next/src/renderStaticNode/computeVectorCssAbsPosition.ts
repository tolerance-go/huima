import { relativePoint } from '../utils/rotatePoint'

/**
 *
 * 1. 生成的 svg 是已经旋转过后的了，所以不需要考虑旋转的问题
 * 2. 根据传入的 absoluteRenderBox 和 parentAbsoluteBoundingBox 计算出相对于父节点的 x，y，
 * 然后根据 constraints 计算出 left，right，top，bottom
 * 注意是 absoluteRenderBox 而不是 absoluteBoundingBox
 *
 * @param param0
 * @returns
 */
export function computeVectorCssAbsPosition({
   parentAbsoluteBoundingBox,
   absoluteRenderBox,
   constraints,
}: {
   parentAbsoluteBoundingBox: Rect
   absoluteRenderBox: Rect
   constraints: Constraints
}) {
   let cssPosition: Record<string, string> = {
      position: 'absolute',
   }

   const upperLeft = relativePoint(absoluteRenderBox, parentAbsoluteBoundingBox)

   switch (constraints.horizontal) {
      case 'MIN':
         cssPosition.left = `${upperLeft.x}px`
         break
      case 'MAX':
         cssPosition.right = `${
            parentAbsoluteBoundingBox.width -
            upperLeft.x -
            absoluteRenderBox.width
         }px`
         break
      case 'CENTER':
         cssPosition.left = `calc(50% - ${absoluteRenderBox.width}px/2 - ${
            parentAbsoluteBoundingBox.width / 2 -
            absoluteRenderBox.width / 2 -
            upperLeft.x
         }px)`
         break
      case 'SCALE':
         cssPosition.left = `${upperLeft.x}px`
         cssPosition.right = `${
            parentAbsoluteBoundingBox.width -
            upperLeft.x -
            absoluteRenderBox.width
         }px`
         break
      case 'STRETCH':
         cssPosition.left = `${
            (upperLeft.x / parentAbsoluteBoundingBox.width) * 100
         }%`
         cssPosition.right = `${
            ((parentAbsoluteBoundingBox.width -
               upperLeft.x -
               absoluteRenderBox.width) /
               parentAbsoluteBoundingBox.width) *
            100
         }%`
         break
   }

   switch (constraints.vertical) {
      case 'MIN':
         cssPosition.top = `${upperLeft.y}px`
         break
      case 'MAX':
         cssPosition.bottom = `${
            parentAbsoluteBoundingBox.height -
            upperLeft.y -
            absoluteRenderBox.height
         }px`
         break
      case 'CENTER':
         cssPosition.top = `calc(50% - ${absoluteRenderBox.height}px/2 - ${
            parentAbsoluteBoundingBox.height / 2 -
            absoluteRenderBox.height / 2 -
            upperLeft.y
         }px)`
         break
      case 'SCALE':
         cssPosition.top = `${upperLeft.y}px`
         cssPosition.bottom = `${
            parentAbsoluteBoundingBox.height -
            upperLeft.y -
            absoluteRenderBox.height
         }px`
         break
      case 'STRETCH':
         cssPosition.top = `${
            (upperLeft.y / parentAbsoluteBoundingBox.height) * 100
         }%`
         cssPosition.bottom = `${
            ((parentAbsoluteBoundingBox.height -
               upperLeft.y -
               absoluteRenderBox.height) /
               parentAbsoluteBoundingBox.height) *
            100
         }%`
         break
   }

   return cssPosition
}
