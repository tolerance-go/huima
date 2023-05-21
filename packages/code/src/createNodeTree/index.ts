import { getBoxSizingCSS } from '../css-converts/getBoxSizingCSS'
import { getLayoutCSS } from '../css-converts/getLayoutCSS'
import { getSizeCSS } from '../css-converts/getSizeCSS'
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
   parentNodeInfo: NodeInfo | undefined = undefined,
   visible: boolean = sceneNode.visible,
   level = 0,
): Promise<NodeTree> {
   console.log('sceneNode', sceneNode, sceneNode.type)

   const nodeInfo = getBaseNodeInfo(sceneNode, parentNodeInfo, visible, level)

   const baseStyle: CSSStyle = {
      ...getBoxSizingCSS(),
      ...getSizeCSS(sceneNode),
      ...getLayoutCSS(sceneNode, nodeInfo, level),
   }

   const getChildren = async (): Promise<NodeTree[]> => {
      return sceneNode.type === 'BOOLEAN_OPERATION'
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
   }

   if (
      'children' in sceneNode &&
      sceneNode.children.some((item) => 'isMask' in item && item.isMask)
   ) {
      return createVectorNode(
         sceneNode,
         baseStyle,
         nodeInfo,
         async () => [],
         level,
      )
   } else if (sceneNode.type === 'FRAME') {
      return createFrameNode(sceneNode, baseStyle, nodeInfo, getChildren)
   } else if (sceneNode.type === 'GROUP') {
      return createGroupNode(sceneNode, baseStyle, nodeInfo, getChildren)
   } else if (sceneNode.type === 'TEXT') {
      return createTextNode(sceneNode, baseStyle, nodeInfo, getChildren)
   } else if (sceneNode.type === 'RECTANGLE') {
      return createRectangleNode(sceneNode, baseStyle, nodeInfo, getChildren)
   } else if (
      sceneNode.type === 'VECTOR' ||
      sceneNode.type === 'BOOLEAN_OPERATION' ||
      sceneNode.type === 'POLYGON' ||
      sceneNode.type === 'STAR' ||
      sceneNode.type === 'LINE'
   ) {
      return createVectorNode(
         sceneNode,
         baseStyle,
         nodeInfo,
         getChildren,
         level,
      )
   } else if (sceneNode.type === 'ELLIPSE') {
      return createEllipseNode(sceneNode, baseStyle, nodeInfo, getChildren)
   } else if (sceneNode.type === 'COMPONENT') {
      return createComponentNode(sceneNode, baseStyle, nodeInfo, getChildren)
   } else if (sceneNode.type === 'INSTANCE') {
      return createInstanceNode(sceneNode, baseStyle, nodeInfo, getChildren)
   }
   return {
      tag: '',
      nodeInfo,
      style: baseStyle,
      children: await getChildren(),
   }
}
