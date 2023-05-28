import {
   StaticBooleanOperationNode,
   StaticFrameNode,
   StaticGroupNode,
} from '@huima/types-next'
import { Buffer } from 'buffer'
import { DSLType, RuntimeEnv } from '../../types'
import { convertCssObjectToString } from '../convertCssObjectToString'
import { convertNodePositionToCss } from '../convertNodePositionToCss'

export const convertBooleanOperationNodeToHtml = (
   runtimeEnv: RuntimeEnv,
   dslType: DSLType,
   node: StaticBooleanOperationNode,
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

   return html.replace('<svg', `<svg role='vector' style="${style}"`)
}
