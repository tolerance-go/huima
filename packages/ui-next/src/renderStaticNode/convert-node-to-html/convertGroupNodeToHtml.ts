import { StaticFrameNode, StaticGroupNode } from '@huima/types-next'
import { renderStaticNode } from '..'
import { DSLType, RuntimeEnv } from '../../types'
import { computeCssAbsPosition } from '../computeCssAbsPosition'
import { convertCssObjectToString } from '../convertCssObjectToString'
import { convertEffectsToFilter } from '../convertEffectsToFilter'
import { convertRotationToCss } from '../convertRotationToCss'

/**
 * group 嵌套 group 的话，我们需要过滤掉中间的 group，直接使用最外层的 group
 * 这样可以避免多余的 div 元素，减少渲染成本，不能完全过滤，因为 group 的子元素
 * 有绝对定位的方式，比如 right，bottom，这些需要保留，因此我们需要判断
 * 如果父节点空（本身是根节点），渲染 div
 * 如果父级是 group，则跳过，直接渲染子节点
 * group 需要渲染 gap，但是就用子节点的绝对定位实现即可
 *
 * @param runtimeEnv
 * @param dslType
 * @param node
 * @param parentNode
 * @returns
 */
export const convertGroupNodeToHtml = (
   runtimeEnv: RuntimeEnv,
   dslType: DSLType,
   node: StaticGroupNode,
   parentNode?: StaticFrameNode | StaticGroupNode,
): string => {
   const { width, height, effects, rotation, children } = node

   // 创建 CSS 对象
   const css: Record<string, string | number | null | undefined> = {
      width: `${width}px`,
      height: `${height}px`,
      ...convertEffectsToFilter(effects),
      ...convertRotationToCss(rotation),
      ...(parentNode &&
      ((parentNode.type === 'frame' && parentNode.layoutMode === 'NONE') ||
         node.layoutPositioning === 'ABSOLUTE')
         ? computeCssAbsPosition({
              rotatedUpperLeft: {
                 x: node.x,
                 y: node.y,
              },
              parentAbsoluteBoundingBox: parentNode.absoluteBoundingBox!,
              absoluteBoundingBox: node.absoluteBoundingBox!,
              constraints: {
                 horizontal: 'MIN',
                 vertical: 'MIN',
              },
              rotation: node.rotation,
           })
         : {}),
   }

   // 转换 CSS 对象为 CSS 字符串
   const style = convertCssObjectToString(css)

   const childrenHtml = children
      .map((item) => {
         return renderStaticNode(runtimeEnv, dslType, item, node)
      })
      .join('\n')

   // 如果父级是 group 节点，直接渲染子节点，不需要渲染 div
   if (parentNode && parentNode.type === 'group') {
      return childrenHtml
   }

   const html = `<div role="group" style="${style}">${childrenHtml}</div>`

   return html
}
