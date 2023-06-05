import { StaticContainerNode, StaticVectorNode } from '@huima/common'
import { getBaseStaticNodeData } from './getBaseStaticNodeData'

export const createStaticStarNode = async (
   node: StarNode,
   parentNode?: StaticContainerNode,
): Promise<StaticVectorNode> => {
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
      fills,
      strokeAlign,
      strokeWeight,
      dashPattern,
      x,
      y,
      layoutPositioning,
      isMask,
   } = node

   return {
      ...getBaseStaticNodeData(node),
      parent: parentNode,
      x,
      y,
      id,
      type: 'vector',
      effects,
      strokes,
      isMask,
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
      layoutPositioning,
      svgBytes: await node.exportAsync({
         format: 'SVG',
      }),
   }
}
