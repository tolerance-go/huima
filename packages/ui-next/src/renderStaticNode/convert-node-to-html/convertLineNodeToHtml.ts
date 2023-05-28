import {
   StaticFrameNode,
   StaticGroupNode,
   StaticLineNode,
} from '@huima/types-next'
import { Buffer } from 'buffer'
import { DSLType, RuntimeEnv } from '../../types'
import { convertCssObjectToString } from '../convertCssObjectToString'
import { convertNodePositionToCss } from '../convertNodePositionToCss'

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
   runtimeEnv: RuntimeEnv,
   dslType: DSLType,
   node: StaticLineNode,
   parentNode?: StaticFrameNode | StaticGroupNode,
) => {
   const { width, height, fills, strokes, effects, rotation } = node

   const html = Buffer.from(node.svgBytes).toString()

   // 创建 CSS 对象
   const css: Record<string, string | number | null | undefined> = {
      ...convertNodePositionToCss(node, parentNode),
   }

   // 转换 CSS 对象为 CSS 字符串
   const style = convertCssObjectToString(css)

   return html.replace('<svg', `<svg role='line' style="${style}"`)
}
