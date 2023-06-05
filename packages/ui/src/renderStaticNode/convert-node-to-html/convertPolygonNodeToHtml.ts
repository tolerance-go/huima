import { StaticContainerNode, StaticPolygonNode } from '@huima/common'
import { Buffer } from 'buffer'
import { BaseConvertSettings } from '../../types'
import { convertNodePositionToCss } from '../convertNodePositionToCss'
import { convertToStyleAndClassAttrs } from '../convertToStyleAndClassAttrs'

/**
 * 根据传入的 node，将 figma node 转换成 html 代码
 * 将 vector 转换成 svg 代码
 * @param runtimeEnv
 * @param dslType
 * @param node
 * @param parentNode
 */
export const convertPolygonNodeToHtml = (
   settings: BaseConvertSettings,
   node: StaticPolygonNode,
   parentNode?: StaticContainerNode,
) => {
   const { width, height, fills, strokes, effects, rotation } = node

   const html = Buffer.from(node.svgBytes).toString()

   // 创建 CSS 对象
   const css: Record<string, string | number | null | undefined> = {
      ...convertNodePositionToCss(settings, node, parentNode),
   }

   return html.replace(
      '<svg',
      `<svg role='polygon' ${convertToStyleAndClassAttrs(css, settings)}`,
   )
}
