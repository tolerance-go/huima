import { StaticContainerNode, StaticVectorNode } from '@huima/types-next'

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
