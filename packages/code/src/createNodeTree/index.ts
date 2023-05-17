import { getBaseLayoutCSS } from '../css-converts/getBaseLayoutCSS'
import { getBaseSizeCSS } from '../css-converts/getBaseSizeCSS'
import { getBaseNodeInfo } from '../getBaseNodeInfo'
import { CSSStyle, NodeInfo, NodeTree } from '../type'
import { createComponentNode } from './createComponentNode'
import { createEllipseNode } from './createEllipseNode'
import { createFrameNode } from './createFrameNode'
import { createGroupNode } from './createGroupNode'
import { createInstanceNode } from './createInstanceNode'
import { createRectangleNode } from './createRectangleNode'
import { createTextNode } from './createTextNode'
import { createVectorNode } from './createVectorNode'

export async function createNodeTree(
   sceneNode: SceneNode,
   parentNodeInfo: NodeInfo,
   visible: boolean = sceneNode.visible,
   level = 0,
): Promise<NodeTree> {
   console.log('sceneNode', sceneNode, sceneNode.type)

   const nodeInfo = getBaseNodeInfo(sceneNode, parentNodeInfo, visible, level)

   const baseStyle: CSSStyle = {
      ...getBaseSizeCSS(sceneNode),
      ...getBaseLayoutCSS(sceneNode, nodeInfo, level),
   }

   const children: NodeTree[] =
      sceneNode.type === 'BOOLEAN_OPERATION'
         ? []
         : 'children' in sceneNode
         ? await Promise.all(
              sceneNode.children.map((item) =>
                 createNodeTree(
                    item,
                    nodeInfo,
                    visible && item.visible,
                    level + 1,
                 ),
              ),
           )
         : []

   if (sceneNode.type === 'FRAME') {
      return createFrameNode(sceneNode, baseStyle, nodeInfo, children)
   } else if (sceneNode.type === 'GROUP') {
      return createGroupNode(sceneNode, baseStyle, nodeInfo, children)
   } else if (sceneNode.type === 'TEXT') {
      return createTextNode(sceneNode, baseStyle, nodeInfo, children)
   } else if (sceneNode.type === 'RECTANGLE') {
      return createRectangleNode(sceneNode, baseStyle, nodeInfo, children)
   } else if (
      sceneNode.type === 'VECTOR' ||
      sceneNode.type === 'BOOLEAN_OPERATION'
   ) {
      return createVectorNode(sceneNode, baseStyle, nodeInfo, children)
   } else if (sceneNode.type === 'ELLIPSE') {
      return createEllipseNode(sceneNode, baseStyle, nodeInfo, children)
   } else if (sceneNode.type === 'COMPONENT') {
      return createComponentNode(sceneNode, baseStyle, nodeInfo, children)
   } else if (sceneNode.type === 'INSTANCE') {
      return createInstanceNode(sceneNode, baseStyle, nodeInfo, children)
   }

   return {
      tag: '',
      nodeInfo,
      style: baseStyle,
      children,
   }
}
