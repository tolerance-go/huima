import { StaticContainerNode, StaticTextNode } from '@huima/types-next'
import { getBaseStaticNodeData } from './getBaseStaticNodeData'

export const createStaticTextNode = (
   node: TextNode,
   parentNode?: StaticContainerNode,
): StaticTextNode => {
   const {
      paragraphSpacing,
      textAutoResize,
      textAlignHorizontal,
      textAlignVertical,
      effects,
      strokes,
      constraints,
      width,
      height,
      rotation,
      isMask,
      blendMode,
      absoluteBoundingBox,
      absoluteRenderBounds,
      absoluteTransform,
      x,
      y,
      layoutPositioning,
   } = node

   // const charItems = node.characters.split(/(\n|(?!\n).)/g).filter(Boolean)
   // const charInfos = getCharPositions(charItems)

   const styledTextSegments = node.getStyledTextSegments([
      'fontSize',
      'fontWeight',
      'fontName',
      'fills',
      'textCase',
      'lineHeight',
      'letterSpacing',
      'textDecoration',
   ])

   return {
      ...getBaseStaticNodeData(node),
      styledTextSegments,
      parent: parentNode,
      x,
      y,
      width,
      height,
      id: node.id,
      type: 'text',
      characters: node.characters,
      paragraphSpacing,
      textAutoResize,
      textAlignHorizontal,
      textAlignVertical,
      effects,
      isMask,
      strokes,
      constraints,
      rotation,
      blendMode,
      absoluteBoundingBox,
      absoluteRenderBounds,
      absoluteTransform,
      layoutPositioning,
   }
}
