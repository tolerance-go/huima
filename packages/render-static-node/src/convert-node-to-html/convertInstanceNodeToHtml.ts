import {
   StaticContainerNode,
   StaticInstanceNode,
} from '@huima/common/dist/types'
import { renderStaticNode } from '..'
import { convertBorderRadiusToCss } from '../convertBorderRadiusToCss'
import { convertFillsToCss } from '../convertFillsToCss'
import { convertFrameEffectsToCss } from '../convertFrameEffectsToCss'
import { convertNodePositionToCss } from '../convertNodePositionToCss'
import { convertRotationToCss } from '../convertRotationToCss'
import { convertStrokesToCss } from '../convertStrokesToCss'
import { convertToStyleAndClassAttrs } from '../convertToStyleAndClassAttrs'
import { getFrameFlexLayoutStyle } from '../getFrameFlexLayoutStyle'
import { BaseConvertSettings, RenderNodeHooks } from '../types'

/**
 * 函数根据传入的 node，将 figma node 转换成 html 代码
 * 如果父节点是 group，并且父节点是根节点，需要设置绝对定位
 * @param node
 */
export const convertInstanceNodeToHtml = (
   settings: BaseConvertSettings,
   node: StaticInstanceNode,
   hooks?: RenderNodeHooks,
   parentNode?: StaticContainerNode,
): string => {
   const {
      width,
      height,
      fills,
      strokes,
      effects,
      cornerRadius,
      rotation,
      children,
   } = node

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

   console.log('parentNode', parentNode)

   // 创建 CSS 对象
   const css: Record<string, string | number | null | undefined> = {
      width: `${width}px`,
      height: `${height}px`,
      ...getFrameFlexLayoutStyle(node),
      ...convertBorderRadiusToCss(cornerRadius),
      ...backgroundColorCss,
      ...borderCss,
      ...boxShadowCss,
      ...transformCss,
      ...convertNodePositionToCss(settings, node, parentNode),
   }

   // 创建 HTML
   const html = `<div role='frame' ${convertToStyleAndClassAttrs(
      css,
      settings,
   )}>
    ${children
       .map((item) => {
          return renderStaticNode(settings, item, hooks, node)
       })
       .join('\n')}</div>`

   return html
}
