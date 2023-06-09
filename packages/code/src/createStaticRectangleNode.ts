import {
   StaticContainerNode,
   StaticRectangleNode,
} from '@huima/common/dist/types'
import { getBaseStaticNodeData } from './getBaseStaticNodeData'
import { getCornerRadius } from './getCornerRadius'
import { getImageFillMeta } from './getImageFillMeta'
import { pluginApi } from './pluginApi'

export const createStaticRectangleNode = async (
   node: RectangleNode,
   parentNode?: StaticContainerNode,
): Promise<StaticRectangleNode> => {
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
      parent,
      x,
      y,
      layoutPositioning,
      isMask,
      strokeRightWeight,
      strokeTopWeight,
      strokeBottomWeight,
      strokeLeftWeight,
   } = node

   return {
      ...getBaseStaticNodeData(node),
      isMask,
      parent: parentNode,
      strokeWeight:
         strokeWeight === pluginApi.mixed
            ? {
                 strokeRightWeight,
                 strokeTopWeight,
                 strokeBottomWeight,
                 strokeLeftWeight,
              }
            : strokeWeight,
      x,
      y,
      id,
      type: 'rectangle',
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
      cornerRadius: getCornerRadius(node),
      fills,
      strokeAlign,
      dashPattern,
      imageFillMeta: await getImageFillMeta(fills as ReadonlyArray<Paint>),
      layoutPositioning,
   }
}
