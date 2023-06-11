import {
   ServerBooleanOperationNode,
   StaticBooleanOperationNode,
   StaticContainerNode,
} from '@huima/common/dist/types'
import { Buffer } from 'buffer'
import { convertNodePositionToCss } from '../convertNodePositionToCss'
import { convertToStyleAndClassAttrs } from '../convertToStyleAndClassAttrs'
import { BaseConvertSettings } from '../types'

export const convertBooleanOperationNodeToHtml = (
   settings: BaseConvertSettings,
   node: StaticBooleanOperationNode | ServerBooleanOperationNode,
   parentNode?: StaticContainerNode,
) => {
   const { width, height, fills, strokes, effects, rotation } = node

   // 创建 CSS 对象
   const css: Record<string, string | number | null | undefined> = {
      ...convertNodePositionToCss(settings, node, parentNode),
   }

   if ('serverNode' in node && node.serverNode) {
      if (!node.svgStr) {
         throw new Error('node.svgStr is undefined')
      }
      return node.svgStr.replace(
         '<svg',
         `<svg role='vector' ${convertToStyleAndClassAttrs(css, settings)}`,
      )
   }

   const html = Buffer.from(node.svgBytes).toString()

   return html.replace(
      '<svg',
      `<svg role='vector' ${convertToStyleAndClassAttrs(css, settings)}`,
   )
}
