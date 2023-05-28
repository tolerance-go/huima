import { StaticContainerNode, StaticEllipseNode } from '@huima/types-next'
import { getImageFillMeta } from './getImageFillMeta'

export const createStaticEllipseNode = async (
   node: EllipseNode,
   parentNode?: StaticContainerNode,
): Promise<StaticEllipseNode> => {
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
   } = node

   return {
      isMask,
      parent: parentNode,
      x,
      y,
      id,
      type: 'ellipse',
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
      layoutPositioning,
      dashPattern,
      imageFillMeta: await getImageFillMeta(fills as ReadonlyArray<Paint>),
   }
}
