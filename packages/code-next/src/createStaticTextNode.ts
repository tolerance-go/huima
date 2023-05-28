import { StaticContainerNode, StaticTextNode } from '@huima/types-next'

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

   const charItems = node.characters.split(/(\n|(?!\n).)/g).filter(Boolean)

   const charInfos = getCharPositions(charItems)

   const styledCharacters = charInfos.map((charInfo) => {
      const { start, end, char } = charInfo
      const fontSize = node.getRangeFontSize(start, end)
      const fontWeight = node.getRangeFontWeight(start, end)
      const fontName = node.getRangeFontName(start, end)
      const fills = node.getRangeFills(start, end)
      const textCase = node.getRangeTextCase(start, end)
      const lineHeight = node.getRangeLineHeight(start, end)
      const letterSpacing = node.getRangeLetterSpacing(start, end)
      const textDecoration = node.getRangeTextDecoration(start, end)
      return {
         start,
         end,
         char,
         fontSize,
         fontWeight,
         fontName,
         fills,
         textCase,
         lineHeight,
         letterSpacing,
         textDecoration,
         // TODO: symbol 的情况没有处理
      } as StaticTextNode['styledCharacters'][number]
   })

   return {
      parent: parentNode,
      x,
      y,
      width,
      height,
      id: node.id,
      type: 'text',
      characters: node.characters,
      styledCharacters,
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
