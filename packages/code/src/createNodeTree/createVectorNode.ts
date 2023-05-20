import { Buffer } from 'buffer'
import { isJsDesign } from '../pluginApi'
import { CSSStyle, NodeInfo, NodeTree } from '../type'

async function exportSVGString(node: VectorNode | BooleanOperationNode) {
   const svgUint8Array = await node.exportAsync({ format: 'SVG' })
   const svgString = Buffer.from(svgUint8Array).toString()
   return svgString
}

export const createVectorNode = async (
   node: VectorNode | BooleanOperationNode,
   baseStyle: CSSStyle,
   nodeInfo: NodeInfo,
   children: NodeTree[],
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
      ...baseStyle,
      width: node.width + 'px',
      height: node.height + 'px',
   }

   return {
      nodeInfo,
      tag,
      style,
      children,
      element: svgStr,
   }
}
