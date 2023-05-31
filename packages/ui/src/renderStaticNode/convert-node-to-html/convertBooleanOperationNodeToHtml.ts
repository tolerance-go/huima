import { StaticBooleanOperationNode, StaticContainerNode } from '@huima/types'
import { Buffer } from 'buffer'
import { BaseConvertSettings } from '../../types'
import { convertNodePositionToCss } from '../convertNodePositionToCss'
import { convertToStyleAndClassAttrs } from '../convertToStyleAndClassAttrs'

export const convertBooleanOperationNodeToHtml = (
   settings: BaseConvertSettings,
   node: StaticBooleanOperationNode,
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
      `<svg role='vector' ${convertToStyleAndClassAttrs(css, settings)}`,
   )
}
