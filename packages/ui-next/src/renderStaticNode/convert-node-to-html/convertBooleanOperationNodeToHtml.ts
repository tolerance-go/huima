import {
   StaticBooleanOperationNode,
   StaticFrameNode,
   StaticGroupNode,
} from '@huima/types-next'
import { Buffer } from 'buffer'
import { DSLType, RuntimeEnv } from '../../types'
import { computeVectorCssAbsPosition } from '../computeVectorCssAbsPosition'
import { convertCssObjectToString } from '../convertCssObjectToString'

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
      // TODO: 判断父容器是不是自动布局，同时判断自己是不是绝对定位
      ...(parentNode
         ? computeVectorCssAbsPosition({
              parentAbsoluteRenderBox: parentNode.absoluteRenderBounds!,
              absoluteRenderBox: node.absoluteRenderBounds!,
              constraints: {
                 horizontal: 'MIN',
                 vertical: 'MIN',
              },
           })
         : {}),
   }

   // 转换 CSS 对象为 CSS 字符串
   const style = convertCssObjectToString(css)

   return html.replace('<svg', `<svg role='vector' style="${style}"`)
}
