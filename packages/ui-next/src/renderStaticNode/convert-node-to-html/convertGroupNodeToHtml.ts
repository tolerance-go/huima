import { StaticContainerNode, StaticGroupNode } from '@huima/types-next'
import { renderStaticNode } from '..'
import { BaseConvertSettings } from '../../types'
import { convertEffectsToFilter } from '../convertEffectsToFilter'
import { convertNodePositionToCss } from '../convertNodePositionToCss'
import { convertRotationToCss } from '../convertRotationToCss'
import { convertToStyleAndClassAttrs } from '../convertToStyleAndClassAttrs'
import { convertMaskNodeToHtml } from './convertMaskNodeToHtml'

/**
 * group 嵌套 group 的话，我们需要过滤掉中间的 group，直接使用最外层的 group
 * 这样可以避免多余的 div 元素，减少渲染成本，不能完全过滤，因为 group 的子元素
 * 有绝对定位的方式，比如 right，bottom，这些需要保留，因此我们需要判断
 * 如果父节点空（本身是根节点），渲染 div
 * 如果父级是 group，则跳过，直接渲染子节点
 * group 需要渲染 gap，但是就用子节点的绝对定位实现即可
 *
 * 如果子节点中包含一个 isMask 为 true 的，那么需要将它处理成 vector
 *
 * @param runtimeEnv
 * @param dslType
 * @param node
 * @param parentNode
 * @returns
 */
export const convertGroupNodeToHtml = (
   settings: BaseConvertSettings,
   node: StaticGroupNode,
   parentNode?: StaticContainerNode,
): string => {
   const { width, height, effects, rotation, children, svgBytes } = node

   if (node.hasMask) {
      return convertMaskNodeToHtml(settings, node, parentNode)
   }

   // 创建 CSS 对象
   const css: Record<string, string | number | null | undefined> = {
      width: `${width}px`,
      height: `${height}px`,
      ...convertEffectsToFilter(effects),
      ...convertRotationToCss(rotation),
      ...convertNodePositionToCss(settings, node, parentNode),
   }

   const childrenHtml = children
      .map((item) => {
         return renderStaticNode(settings, item, node)
      })
      .join('\n')

   // 如果父级是 group 节点，直接渲染子节点，不需要渲染 div
   if (parentNode && parentNode.type === 'group') {
      return childrenHtml
   }

   const html = `<div role="group" ${convertToStyleAndClassAttrs(
      css,
      settings,
   )}>${childrenHtml}</div>`

   return html
}
