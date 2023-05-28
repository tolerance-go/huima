import { StaticContainerNode, StaticLineNode } from '@huima/types-next'

export const createStaticLineNode = async (
   node: LineNode,
   parentNode?: StaticContainerNode,
): Promise<StaticLineNode> => {
   const {
      id,
      effects,
      strokes,
      constraints,
      width,
      height,
      isMask,
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
      parent: parentNode,
      x,
      y,
      id,
      type: 'line',
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
      isMask,
      strokeWeight,
      dashPattern,
      svgBytes: await node.exportAsync({
         format: 'SVG',
      }),
      layoutPositioning,
   }
}