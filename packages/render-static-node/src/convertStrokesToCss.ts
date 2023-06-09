import { StrokeWeightType } from '@huima/common/dist/types'
import { rgbaToHex } from './rgbaToHex'

/**
 * 将Figma的strokes转换为CSS的border属性
 * 1. 如果没有符合条件的 stroke，返回空对象，而不是抛出异常
 * 2. 处理 solid 和 dashed 两种类型
 * 3. 返回对象形式，而不是字符串形式
 * @param strokes
 * @returns
 */
export function convertStrokesToCss(
   strokes: Paint[],
   strokeWeight: StrokeWeightType,
   strokeAlign: 'CENTER' | 'INSIDE' | 'OUTSIDE',
   dashPattern: ReadonlyArray<number>,
): Record<string, string | undefined> {
   // 序列化 strokeWeight 始终返回对象
   if (typeof strokeWeight === 'number') {
      strokeWeight = {
         strokeRightWeight: strokeWeight,
         strokeTopWeight: strokeWeight,
         strokeBottomWeight: strokeWeight,
         strokeLeftWeight: strokeWeight,
      }
   }

   const visibleStrokes = strokes.filter((stroke) => stroke.visible !== false)
   if (visibleStrokes.length === 0) {
      return {}
   }
   const firstStroke = visibleStrokes[0]
   const { color, opacity } = firstStroke as SolidPaint
   const colorString = rgbaToHex(color.r, color.g, color.b, opacity)

   const dashArray = dashPattern ? dashPattern.join(' ') : ''
   const dashType = dashArray ? 'dashed' : 'solid'

   switch (strokeAlign) {
      case 'CENTER': {
         // TODO: add support for strokeAlign 'CENTER', which is currently ignored.
         return {
            'border-left': strokeWeight.strokeLeftWeight
               ? `${strokeWeight.strokeLeftWeight}px ${dashType} ${colorString}`
               : undefined,
            'border-right': strokeWeight.strokeRightWeight
               ? `${strokeWeight.strokeRightWeight}px ${dashType} ${colorString}`
               : undefined,
            'border-bottom': strokeWeight.strokeBottomWeight
               ? `${strokeWeight.strokeBottomWeight}px ${dashType} ${colorString}`
               : undefined,
            'border-top': strokeWeight.strokeTopWeight
               ? `${strokeWeight.strokeTopWeight}px ${dashType} ${colorString}`
               : undefined,
         }
      }
      case 'INSIDE': {
         return {
            'border-left': strokeWeight.strokeLeftWeight
               ? `${strokeWeight.strokeLeftWeight}px ${dashType} ${colorString}`
               : undefined,
            'border-right': strokeWeight.strokeRightWeight
               ? `${strokeWeight.strokeRightWeight}px ${dashType} ${colorString}`
               : undefined,
            'border-bottom': strokeWeight.strokeBottomWeight
               ? `${strokeWeight.strokeBottomWeight}px ${dashType} ${colorString}`
               : undefined,
            'border-top': strokeWeight.strokeTopWeight
               ? `${strokeWeight.strokeTopWeight}px ${dashType} ${colorString}`
               : undefined,
            'box-sizing': 'border-box',
         }
      }
      case 'OUTSIDE': {
         return {
            'border-left': strokeWeight.strokeLeftWeight
               ? `${strokeWeight.strokeLeftWeight}px ${dashType} ${colorString}`
               : undefined,
            'border-right': strokeWeight.strokeRightWeight
               ? `${strokeWeight.strokeRightWeight}px ${dashType} ${colorString}`
               : undefined,
            'border-bottom': strokeWeight.strokeBottomWeight
               ? `${strokeWeight.strokeBottomWeight}px ${dashType} ${colorString}`
               : undefined,
            'border-top': strokeWeight.strokeTopWeight
               ? `${strokeWeight.strokeTopWeight}px ${dashType} ${colorString}`
               : undefined,
         }
      }
      default: {
         return {}
      }
   }
}
