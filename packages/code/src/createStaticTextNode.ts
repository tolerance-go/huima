import { StaticContainerNode, StaticTextNode } from '@huima/types'
import { getBaseStaticNodeData } from './getBaseStaticNodeData'
import { isJsDesign } from './pluginApi'

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

   const styledTextSegments = node.getStyledTextSegments(
      [
         'fontSize',
         'fontName',
         'fills',
         'textCase',
         'lineHeight',
         'letterSpacing',
         'textDecoration',
      ].concat(isJsDesign ? [] : ['fontWeight']) as (keyof Omit<
         StyledTextSegment,
         'characters' | 'start' | 'end'
      >)[],
   )

   console.log('styledTextSegments', styledTextSegments)

   return {
      ...getBaseStaticNodeData(node),
      styledTextSegments: isJsDesign
         ? styledTextSegments.map((item) => ({
              ...item,
              fontWeight: 400,
           }))
         : styledTextSegments,
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
