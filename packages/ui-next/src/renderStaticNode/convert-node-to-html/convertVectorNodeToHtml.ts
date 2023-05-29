import { StaticContainerNode, StaticVectorNode } from '@huima/types-next'
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
export const convertVectorNodeToHtml = (
   settings: BaseConvertSettings,
   node: StaticVectorNode,
   parentNode?: StaticContainerNode,
) => {
   const { width, height, effects, rotation } = node

   // 可能转换失败，导致没有 svgBytes
   if (!node.svgBytes) {
      return ''
   }

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
