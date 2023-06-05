import { StaticContainerNode, StaticGroupNode } from '@huima/common'
import { Buffer } from 'buffer'
import { BaseConvertSettings } from '../../types'
import { convertCssObjectToString } from '../convertCssObjectToString'
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
export const convertMaskNodeToHtml = (
   settings: BaseConvertSettings,
   node: StaticGroupNode,
   parentNode?: StaticContainerNode,
) => {
   const { width, height, effects, rotation, svgBytes } = node

   if (!svgBytes) {
      throw new Error('render mask but svgBytes is undefined.')
   }

   const html = Buffer.from(svgBytes).toString()

   // 创建 CSS 对象
   const css: Record<string, string | number | null | undefined> = {
      ...convertNodePositionToCss(settings, node, parentNode),
   }

   // 转换 CSS 对象为 CSS 字符串
   const style = convertCssObjectToString(css)

   return html.replace(
      '<svg',
      `<svg role='mask' ${convertToStyleAndClassAttrs(css, settings)}`,
   )
}
