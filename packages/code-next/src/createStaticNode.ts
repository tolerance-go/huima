import { StaticNode, StaticTextNode } from '@huima/types-next'

type CharInfo = {
   start: number
   end: number
   char: string
}

function getCharPositions(chars: string[]): CharInfo[] {
   let position = 0
   return chars.map((char) => {
      const start = position
      const end = position + char.length
      position += char.length
      return { start, end, char }
   })
}

export const createStaticTextNode = (
   node: TextNode,
   getChildren: () => StaticNode[],
): StaticTextNode => {
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
      blendMode,
      absoluteBoundingBox,
      absoluteRenderBounds,
      absoluteTransform,
   } = node

   const charItems = node.characters.split(/(\n|(?!\n).)/g).filter(Boolean)

   const charInfos = getCharPositions(charItems)

   console.log('charInfos', charInfos)

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
      parentAbsoluteBoundingBox:
         node.parent && 'absoluteBoundingBox' in node.parent
            ? node.parent.absoluteBoundingBox ?? undefined
            : undefined,
      width,
      height,
      id: node.id,
      type: 'text',
      characters: node.characters,
      styledTextSegments,
      styledCharacters,
      paragraphSpacing,
      textAutoResize,
      textAlignHorizontal,
      textAlignVertical,
      effects,
      strokes,
      constraints,
      rotation,
      blendMode,
      absoluteBoundingBox,
      absoluteRenderBounds,
      absoluteTransform,
   }
}

export const createStaticNode = (node: SceneNode): StaticNode | null => {
   if (node.type === 'TEXT') {
      return createStaticTextNode(
         node,
         () => [],
         //  node.children.map(createStaticNode)
      )
   }

   return null
}
