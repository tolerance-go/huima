import {
   StaticContainerNode,
   StaticPolygonNode,
} from '@huima/common/dist/types'
import { getBaseStaticNodeData } from './getBaseStaticNodeData'

export const createStaticPolygonNode = async (
   node: PolygonNode,
   parentNode?: StaticContainerNode,
): Promise<StaticPolygonNode> => {
   const {
      isMask,
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
      fills,
      strokeAlign,
      strokeWeight,
      dashPattern,
      x,
      y,
      layoutPositioning,
   } = node

   return {
      ...getBaseStaticNodeData(node),
      isMask,
      parent: parentNode,
      x,
      y,
      id,
      type: 'polygon',
      effects,
      strokes,
      constraints,
      width,
      height,
      rotation,
      layoutPositioning,
      blendMode,
      absoluteBoundingBox,
      absoluteRenderBounds,
      absoluteTransform,
      fills,
      strokeAlign,
      strokeWeight,
      dashPattern,
      svgBytes: await node.exportAsync({
         format: 'SVG',
      }),
   }
}
