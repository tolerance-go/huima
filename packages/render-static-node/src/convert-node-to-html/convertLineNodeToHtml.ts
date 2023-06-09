import {
   ServerLineNode,
   StaticContainerNode,
   StaticLineNode,
} from '@huima/common/dist/types'
import { Buffer } from 'buffer'
import { convertNodePositionToCss } from '../convertNodePositionToCss'
import { convertToStyleAndClassAttrs } from '../convertToStyleAndClassAttrs'
import { BaseConvertSettings } from '../types'

/**
 * 根据传入的 node，将 figma node 转换成 html 代码
 * 将 line 转换成 svg 代码
 * 他不处理旋转，生成的 svg 代码已经是旋转过后的了，后期也可以直接当图用
 * 所以 x 和 y，我们这里使用 absoluteBoundingBox 的数据
 * @param runtimeEnv
 * @param dslType
 * @param node
 * @param parentNode
 */
export const convertLineNodeToHtml = (
   settings: BaseConvertSettings,
   node: StaticLineNode | ServerLineNode,
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
      `<svg role='line' ${convertToStyleAndClassAttrs(css, settings)}`,
   )
}
