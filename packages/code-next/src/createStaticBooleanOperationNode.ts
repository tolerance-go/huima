import {
   StaticBooleanOperationNode,
   StaticContainerNode,
} from '@huima/types-next'

export const createStaticBooleanOperationNode = async (
   node: BooleanOperationNode,
   parentNode?: StaticContainerNode,
): Promise<StaticBooleanOperationNode> => {
   const {
      id,
      effects,
      strokes,
      width,
      height,
      rotation,
      blendMode,
      absoluteBoundingBox,
      absoluteRenderBounds,
      absoluteTransform,
      fills,
      strokeAlign,
      isMask,
      strokeWeight,
      dashPattern,
      x,
      y,
      layoutPositioning,
   } = node

   return {
      parent: parentNode,
      x,
      y,
      id,
      type: 'booleanOperation',
      effects,
      strokes,
      width,
      height,
      rotation,
      blendMode,
      absoluteBoundingBox,
      absoluteRenderBounds,
      isMask,
      absoluteTransform,
      fills,
      strokeAlign,
      strokeWeight,
      dashPattern,
      svgBytes: await node.exportAsync({
         format: 'SVG',
      }),
      layoutPositioning,
   }
}
