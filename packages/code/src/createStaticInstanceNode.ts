import {
   StaticContainerNode,
   StaticInstanceNode,
   StaticNode,
} from '@huima/common/dist/types'
import { createStaticNode } from './createStaticNode'
import { getBaseStaticNodeData } from './getBaseStaticNodeData'
import { getCornerRadius } from './getCornerRadius'
import { getImageFillMeta } from './getImageFillMeta'
import { pluginApi } from './pluginApi'

export const createStaticInstanceNode = async (
   node: InstanceNode,
   parentNode?: StaticContainerNode,
): Promise<StaticInstanceNode> => {
   const {
      id,
      effects,
      strokes,
      constraints,
      width,
      height,
      rotation,
      blendMode,
      absoluteBoundingBox,
      absoluteRenderBounds,
      absoluteTransform,
      cornerRadius,
      fills,
      strokeAlign,
      strokeWeight,
      dashPattern,
      children,
      x,
      y,
      layoutMode,
      itemSpacing,
      paddingLeft,
      paddingTop,
      paddingRight,
      paddingBottom,
      counterAxisAlignItems,
      primaryAxisAlignItems,
      layoutPositioning,
      isMask,
      strokeRightWeight,
      strokeTopWeight,
      strokeBottomWeight,
      strokeLeftWeight,
   } = node

   const staticNode: StaticInstanceNode = {
      ...getBaseStaticNodeData(node),
      isMask,
      parent: parentNode,
      x,
      y,

      children: [],
      id,
      type: 'instanceNode',
      effects,
      strokes,
      constraints,
      width,
      height,
      strokeWeight:
         strokeWeight === pluginApi.mixed
            ? {
                 strokeRightWeight,
                 strokeTopWeight,
                 strokeBottomWeight,
                 strokeLeftWeight,
              }
            : strokeWeight,
      rotation,
      cornerRadius: getCornerRadius(node),
      blendMode,
      absoluteBoundingBox,
      absoluteRenderBounds,
      absoluteTransform,
      fills,
      strokeAlign,
      dashPattern,
      imageFillMeta: await getImageFillMeta(fills as ReadonlyArray<Paint>),
      layoutMode,
      itemSpacing,
      paddingLeft,
      paddingTop,
      paddingRight,
      paddingBottom,
      counterAxisAlignItems,
      primaryAxisAlignItems,
      layoutPositioning,
   }

   staticNode.children = (
      await Promise.all(
         children
            // TODO: 这里要结构，否 postmessage 的时候 JSON.stringify 会超出最大调用
            .map((item) => createStaticNode(item, { ...staticNode })),
      )
   ).filter(Boolean) as StaticNode[]

   return staticNode
}
