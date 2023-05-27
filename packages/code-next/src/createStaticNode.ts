import {
   StaticContainerNode,
   StaticFrameNode,
   StaticGroupNode,
   StaticNode,
   StaticRectangleNode,
   StaticSectionNode,
   StaticTextNode,
} from '@huima/types-next'

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
   parentNode?: StaticContainerNode,
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
      x,
      y,
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
      parent: parentNode,
      x,
      y,
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

export const createStaticRectangleNode = (
   node: RectangleNode,
   parentNode?: StaticContainerNode,
): StaticRectangleNode => {
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
   } = node

   return {
      parent: parentNode,
      x,
      y,
      parentAbsoluteBoundingBox:
         node.parent && 'absoluteBoundingBox' in node.parent
            ? node.parent.absoluteBoundingBox ?? undefined
            : undefined,
      id,
      type: 'rectangle',
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
   }
}

export const createStaticFrameNode = (
   node: FrameNode,
   parentNode?: StaticContainerNode,
): StaticFrameNode => {
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
      children,
      x,
      y,
   } = node

   const staticNode: StaticFrameNode = {
      parent: parentNode,
      x,
      y,
      parentAbsoluteBoundingBox:
         node.parent && 'absoluteBoundingBox' in node.parent
            ? node.parent.absoluteBoundingBox ?? undefined
            : undefined,
      children: [],
      id,
      type: 'frame',
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
   }

   staticNode.children = children
      // TODO: 这里要结构，否 postmessage 的时候 JSON.stringify 会超出最大调用
      .map((item) => createStaticNode(item, { ...staticNode }))
      .filter(Boolean) as StaticNode[]

   return staticNode
}

export const createStaticGroupNode = (
   node: GroupNode,
   parentNode?: StaticContainerNode,
): StaticGroupNode => {
   const {
      id,
      effects,
      width,
      height,
      rotation,
      blendMode,
      absoluteBoundingBox,
      absoluteRenderBounds,
      absoluteTransform,
      children,
      x,
      y,
   } = node

   const staticNode: StaticGroupNode = {
      parent: parentNode,
      x,
      y,
      children: [],
      id,
      type: 'group',
      effects,
      width,
      height,
      rotation,
      blendMode,
      absoluteBoundingBox,
      absoluteRenderBounds,
      absoluteTransform,
      parentAbsoluteBoundingBox:
         node.parent && 'absoluteBoundingBox' in node.parent
            ? node.parent.absoluteBoundingBox ?? undefined
            : undefined,
   }

   staticNode.children = children
      // TODO: 这里要结构，否 postmessage 的时候 JSON.stringify 会超出最大调用

      .map((item) => createStaticNode(item, { ...staticNode }))
      .filter(Boolean) as StaticNode[]

   return staticNode
}

export const createStaticSectionNode = (
   node: SectionNode,
   parentNode?: StaticContainerNode,
): StaticSectionNode => {
   const {
      id,
      width,
      height,
      absoluteBoundingBox,
      absoluteTransform,
      children,
      fills,
      x,
      y,
   } = node

   const staticNode: StaticSectionNode = {
      parent: parentNode,
      x,
      y,
      children: [],
      id,
      fills,
      type: 'section',
      width,
      height,
      absoluteTransform,
      absoluteBoundingBox,
      parentAbsoluteBoundingBox:
         node.parent && 'absoluteBoundingBox' in node.parent
            ? node.parent.absoluteBoundingBox ?? undefined
            : undefined,
   }

   staticNode.children = children
      // TODO: 这里要结构，否 postmessage 的时候 JSON.stringify 会超出最大调用
      .map((item) => createStaticNode(item, { ...staticNode }))
      .filter(Boolean) as StaticNode[]

   return staticNode
}

export const createStaticNode = (
   node: SceneNode,
   parent?: StaticContainerNode,
): StaticNode | null => {
   if (node.type === 'TEXT') {
      return createStaticTextNode(node, parent)
   }

   if (node.type === 'RECTANGLE') {
      return createStaticRectangleNode(node, parent)
   }

   if (node.type === 'FRAME') {
      return createStaticFrameNode(node, parent)
   }

   if (node.type === 'GROUP') {
      return createStaticGroupNode(node, parent)
   }

   if (node.type === 'SECTION') {
      return createStaticSectionNode(node, parent)
   }

   return null
}
