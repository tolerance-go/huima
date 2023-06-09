import { Point } from '@huima/common/types'

// 将 a 点的坐标转换为基于 b 点的坐标系
export const relativePoint = (a: Point, b: Point) => {
   return {
      x: a.x - b.x,
      y: a.y - b.y,
   }
}
