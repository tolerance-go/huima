import { ImageFillMeta, StaticNode } from '@huima/types'
import { RenderNodeHooks } from '../types'
import { rgbaToHex } from './rgbaToHex'

/**
 * 将Figma的fills转换为CSS的background属性
 * 1. 额外处理渐变色的 fill
 * 2. 如果没有符合条件的 fill，返回 none，而不是抛出异常
 * 3. 处理图片的 fill，需要处理 figma 中的各种填充模式
 * @param fills
 * @returns
 */
export function convertFillsToCss(
   fills: Paint[],
   node: StaticNode,
   imageFillMeta?: ImageFillMeta,
   hooks?: RenderNodeHooks,
): Record<string, string> {
   const visibleFills = fills.filter((fill) => fill.visible !== false)
   if (visibleFills.length === 0) {
      return {}
   }
   const firstFill = visibleFills[0]
   switch (firstFill.type) {
      case 'SOLID': {
         const { color, opacity } = firstFill as SolidPaint
         return {
            'background-color': rgbaToHex(color.r, color.g, color.b, opacity),
         }
      }
      case 'GRADIENT_LINEAR': {
         const { gradientStops } = firstFill as GradientPaint
         const gradientColors = gradientStops.map(
            (stop) =>
               `${rgbaToHex(
                  stop.color.r,
                  stop.color.g,
                  stop.color.b,
                  stop.color.a,
               )} ${stop.position * 100}%`,
         )
         return { background: `linear-gradient(${gradientColors.join(', ')})` }
      }
      case 'IMAGE': {
         if (!imageFillMeta) return {}

         const imageFill = firstFill as ImagePaint
         const backgroundSize =
            imageFill.scaleMode === 'FILL' ? 'cover' : 'contain'

         const url = URL.createObjectURL(
            new Blob([imageFillMeta!.imageBytes], {
               type: `image/${imageFillMeta!.imageExtension}`,
            }),
         )
         let backgroundImage = `url(${url})`

         if (hooks?.convertBackgroundImage) {
            backgroundImage = hooks.convertBackgroundImage(
               backgroundImage,
               imageFillMeta!,
               node,
            )
         }

         return {
            'background-image': backgroundImage,
            'background-size': backgroundSize,
            'background-repeat': 'no-repeat',
            'background-position': 'center',
         }
      }
      default: {
         return {}
      }
   }
}
