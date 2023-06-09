import { StaticContainerNode, StaticNode } from '@huima/common/dist/types'
import { createStaticBooleanOperationNode } from './createStaticBooleanOperationNode'
import { createStaticComponentNode } from './createStaticComponentNode'
import { createStaticEllipseNode } from './createStaticEllipseNode'
import { createStaticFrameNode } from './createStaticFrameNode'
import { createStaticGroupNode } from './createStaticGroupNode'
import { createStaticInstanceNode } from './createStaticInstanceNode'
import { createStaticLineNode } from './createStaticLineNode'
import { createStaticPolygonNode } from './createStaticPolygonNode'
import { createStaticRectangleNode } from './createStaticRectangleNode'
import { createStaticStarNode } from './createStaticStarNode'
import { createStaticTextNode } from './createStaticTextNode'
import { createStaticVectorNode } from './createStaticVectorNode'

// export const createStaticSectionNode = async (
//    node: SectionNode,
//    parentNode?: StaticContainerNode,
// ): Promise<StaticSectionNode> => {
//    const {
//       id,
//       width,
//       height,
//       absoluteBoundingBox,
//       absoluteTransform,
//       children,
//       fills,
//       x,
//       y,
//    } = node

//    const staticNode: StaticSectionNode = {
//       parent: parentNode,
//       x,
//       y,
//       children: [],
//       id,
//       fills,
//       type: 'section',
//       width,
//       height,
//       absoluteTransform,
//       absoluteBoundingBox,
//       parentAbsoluteBoundingBox:
//          node.parent && 'absoluteBoundingBox' in node.parent
//             ? node.parent.absoluteBoundingBox ?? undefined
//             : undefined,
//    }

//    staticNode.children = (
//       await Promise.all(
//          children
//             // TODO: 这里要结构，否 postmessage 的时候 JSON.stringify 会超出最大调用
//             .map((item) => createStaticNode(item, { ...staticNode })),
//       )
//    ).filter(Boolean) as StaticNode[]

//    return staticNode
// }

export const createStaticNode = async (
   node: SceneNode,
   parent?: StaticContainerNode,
): Promise<StaticNode | null> => {
   if (node.visible === false) return null

   if (node.type === 'TEXT') {
      return createStaticTextNode(node, parent)
   }

   if (node.type === 'RECTANGLE') {
      return createStaticRectangleNode(node, parent)
   }

   if (node.type === 'ELLIPSE') {
      return createStaticEllipseNode(node, parent)
   }

   if (node.type === 'FRAME') {
      return createStaticFrameNode(node, parent)
   }

   if (node.type === 'GROUP') {
      return createStaticGroupNode(node, parent)
   }

   // if (node.type === 'SECTION') {
   //    return createStaticSectionNode(node, parent)
   // }

   if (node.type === 'LINE') {
      return createStaticLineNode(node, parent)
   }

   if (node.type === 'VECTOR') {
      return createStaticVectorNode(node, parent)
   }

   if (node.type === 'STAR') {
      return createStaticStarNode(node, parent)
   }

   if (node.type === 'POLYGON') {
      return createStaticPolygonNode(node, parent)
   }

   if (node.type === 'BOOLEAN_OPERATION') {
      return createStaticBooleanOperationNode(node, parent)
   }

   if (node.type === 'INSTANCE') {
      return createStaticInstanceNode(node, parent)
   }

   if (node.type === 'COMPONENT') {
      return createStaticComponentNode(node, parent)
   }

   return null
}
