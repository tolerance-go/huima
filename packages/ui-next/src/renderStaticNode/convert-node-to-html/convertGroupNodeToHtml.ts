import { StaticFrameNode, StaticGroupNode } from '@huima/types-next'
import { renderStaticNode } from '..'
import { DSLType, RuntimeEnv } from '../../types'
import { computeCssAbsPosition } from '../computeCssAbsPosition'
import { convertCssObjectToString } from '../convertCssObjectToString'
import { convertEffectsToFilter } from '../convertEffectsToFilter'
import { convertRotationToCss } from '../convertRotationToCss'

/**
 * 作为根节点渲染的时候，或者父节点是 autoLayout，使用 div 元素
 * 如果作为子节点渲染的时候，直接跳过
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
      parentNode.type === 'frame' &&
      parentNode.layoutMode !== 'NONE' &&
      node.layoutPositioning === 'ABSOLUTE'
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

   // 存在父节点，且不是 frame + autoLayout，直接跳过返回子节点
   if (
      parentNode &&
      !(parentNode.type === 'frame' && parentNode.layoutMode !== 'NONE')
   ) {
      return childrenHtml
   }

   // 如果为根节点
   const html = `<div role="group" style="${style}">${childrenHtml}</div>`

   return html
}
