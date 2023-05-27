import { Point } from '@huima/types-next'

// 将 a 点的坐标转换为基于 b 点的坐标系
export const relativePoint = (a: Point, b: Point) => {
   return {
      x: a.x - b.x,
      y: a.y - b.y,
   }
}

// 计算中心点坐标
export const getCenterPoint = (rect: Rect) => {
   return {
      x: rect.x + rect.width / 2,
      y: rect.y + rect.height / 2,
   }
}

// 根据旋转后的左上角坐标、旋转中心坐标和旋转角度，计算旋转前的左上角坐标
export function rotatePoint(
   rotatedUpperLeft: Point,
   center: Point,
   angleDegree: number,
): Point {
   const rad = (angleDegree * Math.PI) / 180
   const relativeX = rotatedUpperLeft.x - center.x
   const relativeY = rotatedUpperLeft.y - center.y
   const originalX = relativeX * Math.cos(rad) - relativeY * Math.sin(rad)
   const originalY = relativeX * Math.sin(rad) + relativeY * Math.cos(rad)

   return {
      x: originalX + center.x,
      y: originalY + center.y,
   }
}
