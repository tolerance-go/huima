import { Point } from '@huima/types-next'
import { relativePoint } from '../utils/rotatePoint'

/**
 * 这个函数根据传入的 parentAbsoluteBoundingBox 和 absoluteBoundingBox，以及
 * constraints 类型计算出 css 的定位属性，规则如下
 * 当 constraints.horizontal 为 MIN 的情况，使用 absoluteBoundingBox 的 x 作为 left
 * 当 constraints.horizontal 为 MAX 的情况，使用 absoluteBoundingBox 的 x + width 作为 right
 * 当 constraints.horizontal 为 CENTER 的情况，left: calc(50% - width/2 + 相对于父节点中心点水平方向的偏移);
 * 当 constraints.horizontal 为 SCALE 的情况，left 和 right 同时设置固定值
 * 当 constraints.horizontal 为 STRETCH 的情况，left 和 right 同时设置为百分比
 * 水平方向规则同理
 * 始终为绝对定位
 * 1. 传入父节点的旋转角度和当前节点的旋转角度，在计算 relativeX 和 relativeY 时，需要考虑旋转角度
 * 先计算出各自旋转前的坐标，用它们计算出相对于父节点的坐标，因为 css 的旋转是以旋转前的坐标旋转的
 */
export function computeCssAbsPosition({
   rotatedUpperLeft,
   parentAbsoluteBoundingBox,
   absoluteBoundingBox,
   constraints,
   rotation,
}: {
   rotatedUpperLeft: Point
   parentAbsoluteBoundingBox: Rect
   absoluteBoundingBox: Rect
   constraints: Constraints
   rotation: number
}) {
   let cssPosition: Record<string, string> = {
      position: 'absolute',
   }

   // node 的 x，y 是相对于父节点的 absBoundingRect 的
   // const upperLeft = rotatePoint(
   //    rotatedUpperLeft,
   //    relativePoint(
   //       getCenterPoint(absoluteBoundingBox),
   //       parentAbsoluteBoundingBox,
   //    ),
   //    rotation,
   // )
   const upperLeft = relativePoint(
      absoluteBoundingBox,
      parentAbsoluteBoundingBox,
   )

   switch (constraints.horizontal) {
      case 'MIN':
         cssPosition.left = `${upperLeft.x}px`
         break
      case 'MAX':
         cssPosition.right = `${
            parentAbsoluteBoundingBox.width -
            upperLeft.x -
            absoluteBoundingBox.width
         }px`
         break
      case 'CENTER':
         cssPosition.left = `calc(50% - ${absoluteBoundingBox.width}px/2 - ${
            parentAbsoluteBoundingBox.width / 2 -
            absoluteBoundingBox.width / 2 -
            upperLeft.x
         }px)`
         break
      case 'SCALE':
         cssPosition.left = `${upperLeft.x}px`
         cssPosition.right = `${
            parentAbsoluteBoundingBox.width -
            upperLeft.x -
            absoluteBoundingBox.width
         }px`
         break
      case 'STRETCH':
         cssPosition.left = `${
            (upperLeft.x / parentAbsoluteBoundingBox.width) * 100
         }%`
         cssPosition.right = `${
            ((parentAbsoluteBoundingBox.width -
               upperLeft.x -
               absoluteBoundingBox.width) /
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
            absoluteBoundingBox.height
         }px`
         break
      case 'CENTER':
         cssPosition.top = `calc(50% - ${absoluteBoundingBox.height}px/2 - ${
            parentAbsoluteBoundingBox.height / 2 -
            absoluteBoundingBox.height / 2 -
            upperLeft.y
         }px)`
         break
      case 'SCALE':
         cssPosition.top = `${upperLeft.y}px`
         cssPosition.bottom = `${
            parentAbsoluteBoundingBox.height -
            upperLeft.y -
            absoluteBoundingBox.height
         }px`
         break
      case 'STRETCH':
         cssPosition.top = `${
            (upperLeft.y / parentAbsoluteBoundingBox.height) * 100
         }%`
         cssPosition.bottom = `${
            ((parentAbsoluteBoundingBox.height -
               upperLeft.y -
               absoluteBoundingBox.height) /
               parentAbsoluteBoundingBox.height) *
            100
         }%`
         break
   }

   return cssPosition
}
