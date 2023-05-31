import { StaticContainerNode, StaticGroupNode, StaticNode } from '@huima/types'
import { createStaticNode } from './createStaticNode'
import { getBaseStaticNodeData } from './getBaseStaticNodeData'

export const createStaticGroupNode = async (
   node: GroupNode,
   parentNode?: StaticContainerNode,
): Promise<StaticGroupNode> => {
   const {
      id,
      effects,
      width,
      height,
      rotation,
      blendMode,
      absoluteBoundingBox,
      absoluteRenderBounds,
      absoluteTransform,
      children,
      x,
      y,
      layoutPositioning,
      isMask,
   } = node

   const hasMask = node.children.some((item) => 'isMask' in item && item.isMask)

   const staticNode: StaticGroupNode = {
      ...getBaseStaticNodeData(node),
      isMask,
      parent: parentNode,
      x,
      y,
      children: [],
      id,
      type: 'group',
      hasMask,
      effects,
      width,
      height,
      rotation,
      blendMode,
      absoluteBoundingBox,
      absoluteRenderBounds,
      absoluteTransform,
      layoutPositioning,

      svgBytes: hasMask
         ? await node.exportAsync({
              format: 'SVG',
           })
         : undefined,
   }

   staticNode.children = hasMask
      ? []
      : ((
           await Promise.all(
              children
                 // TODO: 这里要结构，否 postmessage 的时候 JSON.stringify 会超出最大调用
                 .map((item) => createStaticNode(item, { ...staticNode })),
           )
        ).filter(Boolean) as StaticNode[])

   return staticNode
}
