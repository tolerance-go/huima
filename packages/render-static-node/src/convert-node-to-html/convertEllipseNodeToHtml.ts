import { isCircle } from '@huima/common/dist/isCircle'
import {
   StaticContainerNode,
   StaticEllipseNode,
} from '@huima/common/dist/types'
import { Buffer } from 'buffer'
import { convertCssObjectToString } from '../convertCssObjectToString'
import { convertFillsToCss } from '../convertFillsToCss'
import { convertFrameEffectsToCss } from '../convertFrameEffectsToCss'
import { convertNodePositionToCss } from '../convertNodePositionToCss'
import { convertRotationToCss } from '../convertRotationToCss'
import { convertStrokesToCss } from '../convertStrokesToCss'
import { convertToStyleAndClassAttrs } from '../convertToStyleAndClassAttrs'
import { BaseConvertSettings, RenderNodeHooks } from '../types'

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
export function convertEllipseNodeToHtml(
   settings: BaseConvertSettings,
   node: StaticEllipseNode,
   hooks?: RenderNodeHooks,
   parentNode?: StaticContainerNode,
): string {
   // 获取 node 中的属性值
   const {
      width,
      height,
      cornerRadius,
      arcData,
      fills,
      strokes,
      effects,
      rotation,
   } = node

   if (!isCircle(arcData)) {
      // 可能转换失败，导致没有 svgBytes
      if (!node.svgBytes) {
         return ''
      }

      const html = Buffer.from(node.svgBytes).toString()

      return `<div style="${convertCssObjectToString({
         width: `${width}px`,
         height: `${height}px`,
         // 居中显示
         display: 'flex',
         'justify-content': 'center',
         'align-items': 'center',
         ...convertNodePositionToCss(settings, node, parentNode),
      })}">${html.replace('<svg', `<svg role='ellipse-vector'`)}</div>`
   }

   // 转换颜色，边框和效果为 CSS 属性
   const backgroundColorCss = convertFillsToCss(
      fills as Paint[],
      node,
      node.imageFillMeta,
      hooks,
   )
   const borderCss = convertStrokesToCss(
      strokes as Paint[],
      node.strokeWeight as number,
      node.strokeAlign,
      node.dashPattern,
   )
   const boxShadowCss = convertFrameEffectsToCss(effects)
   const transformCss = convertRotationToCss(rotation)

   // 创建 CSS 对象
   const css: Record<string, string | number | null | undefined> = {
      width: `${width}px`,
      height: `${height}px`,
      'border-radius': '100%',
      ...backgroundColorCss,
      ...borderCss,
      ...boxShadowCss,
      ...transformCss,
      ...convertNodePositionToCss(settings, node, parentNode),
   }

   // 创建 HTML
   const html = `<div ${convertToStyleAndClassAttrs(css, settings)}></div>`

   return html
}
