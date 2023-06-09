import {
   ServerRectangleNode,
   StaticContainerNode,
   StaticRectangleNode,
} from '@huima/common/dist/types'
import { convertBorderRadiusToCss } from '../convertBorderRadiusToCss'
import { convertFillsToCss } from '../convertFillsToCss'
import { convertFrameEffectsToCss } from '../convertFrameEffectsToCss'
import { convertNodePositionToCss } from '../convertNodePositionToCss'
import { convertStrokesToCss } from '../convertStrokesToCss'
import { convertToStyleAndClassAttrs } from '../convertToStyleAndClassAttrs'
import { BaseConvertSettings, RenderNodeHooks } from '../types'
// import { getAbsoluteAnchorPoint } from '../getAbsoluteAnchorPoint'

/**
 * 根据传入的 node，将 figma node 转换成 html 代码
 * 将矩形节点转换成 html 代码
 * 基本结构为一个 div，传入的类型为 StaticRectangleNode
 * 根据参数的 width 和 height 设置 div 的宽高
 * 根据传入的 cornerRadius 设置 div 的圆角
 * 根据传入的 fills 设置 div 的背景色，找到第一个可见 fill，如果没有可见 fill，则设置为空，注意处理渐变色
 * 根据传入的 strokes 设置 div 的边框，找到第一个可见 stroke，如果没有可见 stroke，则设置为空，
 * 注意处理边框的位置信息，比如 center，outside，inside
 * 根据传入的 effects 设置 div 的阴影，找到第一个可见 effect，如果没有可见 effect，则设置为空
 * 根据传入的 rotation 设置 div 的旋转角度
 */
export function convertRectangleNodeToHtml(
   settings: BaseConvertSettings,
   node: StaticRectangleNode | ServerRectangleNode,
   hooks?: RenderNodeHooks,
   parentNode?: StaticContainerNode,
): string {
   // 获取 node 中的属性值
   const { width, height, cornerRadius, fills, strokes, effects, rotation } =
      node

   // 转换颜色，边框和效果为 CSS 属性
   const backgroundColorCss = convertFillsToCss(
      fills as Paint[],
      node,
      node.imageFillMeta,
      hooks,
   )
   const borderCss = convertStrokesToCss(
      strokes as Paint[],
      node.strokeWeight,
      node.strokeAlign,
      node.dashPattern,
   )
   const boxShadowCss = convertFrameEffectsToCss(effects)
   // const transformCss = convertRotationToCss(rotation)

   // 创建 CSS 对象
   const css: Record<string, string | number | null | undefined> = {
      width: `${width}px`,
      height: `${height}px`,
      ...convertBorderRadiusToCss(cornerRadius),
      ...backgroundColorCss,
      ...borderCss,
      ...boxShadowCss,
      // ...transformCss,
      ...convertNodePositionToCss(settings, node, parentNode),
   }

   // console.log('11getAbsoluteAnchorPoint', getAbsoluteAnchorPoint(node))
   // console.log('11absoluteBoundingBox', node.absoluteBoundingBox)

   // 创建 HTML
   const html = `<div ${convertToStyleAndClassAttrs(css, settings)}></div>`

   return html
}
