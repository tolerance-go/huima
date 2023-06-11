import {
   ServerStarNode,
   StaticContainerNode,
   StaticStarNode,
} from '@huima/common/dist/types'
import { Buffer } from 'buffer'
import { convertNodePositionToCss } from '../convertNodePositionToCss'
import { convertToStyleAndClassAttrs } from '../convertToStyleAndClassAttrs'
import { BaseConvertSettings } from '../types'

/**
 * 根据传入的 node，将 figma node 转换成 html 代码
 * 将 vector 转换成 svg 代码
 * @param runtimeEnv
 * @param dslType
 * @param node
 * @param parentNode
 */
export const convertStarNodeToHtml = (
   settings: BaseConvertSettings,
   node: StaticStarNode | ServerStarNode,
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
      `<svg role='star' ${convertToStyleAndClassAttrs(css, settings)}`,
   )
}
