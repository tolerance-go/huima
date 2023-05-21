import { Point } from '@huima/types'

// 这个函数的输入参数是旋转后的左上角坐标（一个包含 x 和 y 属性的对象），旋转的角度（以度为单位），以及旋转图形的宽度和高度。它返回的是一个包含 x 和 y 属性的对象，表示旋转前的左上角坐标。
export function computeOriginalCoordinates(
   rotatedUpperLeft: Point,
   angleDegree: number,
   center: Point,
): Point {
   // 将旋转角度转换为弧度
   const rad = (angleDegree * Math.PI) / 180

   // 计算相对于旋转中心的坐标
   const relative = {
      x: rotatedUpperLeft.x - center.x,
      y: rotatedUpperLeft.y - center.y,
   }

   // 使用旋转矩阵的逆矩阵来计算旋转前的坐标
   const originalUpperLeft = {
      x: relative.x * Math.cos(rad) + relative.y * Math.sin(rad) + center.x,
      y: -relative.x * Math.sin(rad) + relative.y * Math.cos(rad) + center.y,
   }

   return originalUpperLeft
}
