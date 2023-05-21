import { Buffer } from 'buffer'
import { getLayoutCSS } from '../css-converts/getLayoutCSS'
import { getRotationCSS } from '../css-converts/getRotationCSS'
import { isJsDesign } from '../pluginApi'
import { CSSStyle, NodeInfo, NodeTree } from '../type'

type SVGVectorNode =
   | VectorNode
   | BooleanOperationNode
   | PolygonNode
   | StarNode
   | LineNode
   | FrameNode
   | GroupNode
   | ComponentSetNode
   | ComponentNode
   | InstanceNode
   | SectionNode

async function exportSVGString(node: SVGVectorNode) {
   const svgUint8Array = await node.exportAsync({ format: 'SVG' })
   const svgString = Buffer.from(svgUint8Array).toString()
   return svgString
}

export const createVectorNode = async (
   node: SVGVectorNode,
   baseStyle: CSSStyle,
   nodeInfo: NodeInfo,
   children: NodeTree[],
   level: number,
): Promise<NodeTree> => {
   console.log('createVectorNode', node)

   // NOTE - 隐藏的元素导出会报错
   const svgStr = nodeInfo.parentsVisible
      ? await (isJsDesign
           ? // 在 Figma 的旧版本 API 中，如果你不能直接导出 SVG_STRING，但你可以将 SVG 格式导出到 Uint8Array，然后使用 TextDecoder 将其转换为字符串
             exportSVGString(node)
           : node.exportAsync({ format: 'SVG_STRING' }))
      : undefined

   let tag = 'svg'
   let style = {
      ...('rotation' in node ? getRotationCSS(node) : undefined),
      ...getLayoutCSS(node, nodeInfo, level),
   }

   return {
      nodeInfo,
      tag,
      style,
      children,
      element: svgStr,
   }
}
