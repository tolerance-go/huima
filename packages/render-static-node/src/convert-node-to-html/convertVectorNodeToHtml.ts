import {
   ServerVectorNode,
   StaticContainerNode,
   StaticVectorNode,
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
export const convertVectorNodeToHtml = (
   settings: BaseConvertSettings,
   node: StaticVectorNode | ServerVectorNode,
   parentNode?: StaticContainerNode,
) => {
   const { width, height, effects, rotation } = node

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

   // 可能转换失败，导致没有 svgBytes
   if (!node.svgBytes) {
      return ''
   }

   const html = Buffer.from(node.svgBytes).toString()

   return html.replace(
      '<svg',
      `<svg role='vector' ${convertToStyleAndClassAttrs(css, settings)}`,
   )
}
