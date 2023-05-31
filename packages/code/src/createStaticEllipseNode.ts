import { StaticContainerNode, StaticEllipseNode } from '@huima/types'
import { isCircle } from '@huima/utils'
import { getBaseStaticNodeData } from './getBaseStaticNodeData'
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
      arcData,
   } = node

   let svgBytes: Uint8Array | undefined
   try {
      if (!isCircle(arcData)) {
         svgBytes = await node.exportAsync({
            format: 'SVG',
         })
      }
   } catch {
      // ignore
   }

   return {
      ...getBaseStaticNodeData(node),
      svgBytes,
      arcData,
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
