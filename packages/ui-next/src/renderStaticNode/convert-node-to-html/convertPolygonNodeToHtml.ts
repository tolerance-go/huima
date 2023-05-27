import {
   StaticFrameNode,
   StaticGroupNode,
   StaticPolygonNode,
} from '@huima/types-next'
import { DSLType, RuntimeEnv } from '../../types'
import { computeVectorCssAbsPosition } from '../computeVectorCssAbsPosition'
import { convertCssObjectToString } from '../convertCssObjectToString'

/**
 * 根据传入的 node，将 figma node 转换成 html 代码
 * 将 vector 转换成 svg 代码
 * @param runtimeEnv
 * @param dslType
 * @param node
 * @param parentNode
 */
export const convertPolygonNodeToHtml = (
   runtimeEnv: RuntimeEnv,
   dslType: DSLType,
   node: StaticPolygonNode,
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
              constraints: node.constraints,
           })
         : {}),
   }

   // 转换 CSS 对象为 CSS 字符串
   const style = convertCssObjectToString(css)

   return html.replace('<svg', `<svg role='polygon' style="${style}"`)
}
