import { StaticContainerNode, StaticVectorNode } from '@huima/types'
import { getBaseStaticNodeData } from './getBaseStaticNodeData'

export const createStaticVectorNode = async (
   node: VectorNode,
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
      isMask,
      absoluteTransform,
      fills,
      strokeAlign,
      strokeWeight,
      dashPattern,
      x,
      y,
      layoutPositioning,
   } = node

   let svgBytes: Uint8Array | undefined
   try {
      svgBytes = await node.exportAsync({
         format: 'SVG',
      })
   } catch {
      // ignore
   }

   return {
      ...getBaseStaticNodeData(node),
      parent: parentNode,
      x,
      y,
      id,
      type: 'vector',
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
      svgBytes,
      layoutPositioning,
   }
}
