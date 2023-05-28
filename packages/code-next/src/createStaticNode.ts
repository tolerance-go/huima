import {
   ImageFillMeta,
   StaticBooleanOperationNode,
   StaticContainerNode,
   StaticEllipseNode,
   StaticFrameNode,
   StaticGroupNode,
   StaticLineNode,
   StaticNode,
   StaticPolygonNode,
   StaticRectangleNode,
   StaticTextNode,
   StaticVectorNode,
} from '@huima/types-next'
import { pluginApi } from './pluginApi'

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

   return {
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
      svgBytes: await node.exportAsync({
         format: 'SVG',
      }),
      layoutPositioning,
   }
}

export const createStaticStarNode = async (
   node: StarNode,
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
      absoluteTransform,
      fills,
      strokeAlign,
      strokeWeight,
      dashPattern,
      x,
      y,
      layoutPositioning,
      isMask,
   } = node

   return {
      parent: parentNode,
      x,
      y,
      id,
      type: 'vector',
      effects,
      strokes,
      isMask,
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
      strokeWeight,
      dashPattern,
      layoutPositioning,
      svgBytes: await node.exportAsync({
         format: 'SVG',
      }),
   }
}

export const createStaticPolygonNode = async (
   node: PolygonNode,
   parentNode?: StaticContainerNode,
): Promise<StaticPolygonNode> => {
   const {
      isMask,
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
      fills,
      strokeAlign,
      strokeWeight,
      dashPattern,
      x,
      y,
      layoutPositioning,
   } = node

   return {
      isMask,
      parent: parentNode,
      x,
      y,
      id,
      type: 'polygon',
      effects,
      strokes,
      constraints,
      width,
      height,
      rotation,
      layoutPositioning,
      blendMode,
      absoluteBoundingBox,
      absoluteRenderBounds,
      absoluteTransform,
      fills,
      strokeAlign,
      strokeWeight,
      dashPattern,
      svgBytes: await node.exportAsync({
         format: 'SVG',
      }),
   }
}

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

/**
 * 这个函数接受 fills 数组，目前只处理第一个元素
 * 如果是图片，则返回 ImageFillMeta 类型对象
 */
async function getImageFillMeta(
   fills: ReadonlyArray<Paint>,
): Promise<ImageFillMeta | undefined> {
   const fill = fills[0]
   if (fill?.type === 'IMAGE') {
      const { imageHash } = fill as ImagePaint

      if (imageHash) {
         const image = pluginApi.getImageByHash(imageHash)

         if (image) {
            const bytes = await image.getBytesAsync()

            const imageBytes = bytes

            let extension = ''
            const header = bytes.slice(0, 3)

            // Convert Uint8Array to hexadecimal
            let hex = ''
            for (let i = 0; i < header.length; i++) {
               hex += header[i].toString(16)
            }

            switch (hex) {
               case '89504e':
                  extension = 'png'
                  break
               case '474946':
                  extension = 'gif'
                  break
               case 'ffd8ff':
                  extension = 'jpg'
                  break
               default:
                  extension = 'png' // default to png if unable to determine
            }
            const imageExtension = extension

            return {
               imageBytes,
               imageByteLength: bytes.byteLength,
               imageExtension,
            }
         }
      }
   }
}

export const createStaticRectangleNode = async (
   node: RectangleNode,
   parentNode?: StaticContainerNode,
): Promise<StaticRectangleNode> => {
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
      imageFillMeta: await getImageFillMeta(fills as ReadonlyArray<Paint>),
      layoutPositioning,
   }
}

export const createStaticFrameNode = async (
   node: FrameNode,
   parentNode?: StaticContainerNode,
): Promise<StaticFrameNode> => {
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
      layoutMode,
      itemSpacing,
      paddingLeft,
      paddingTop,
      paddingRight,
      paddingBottom,
      counterAxisAlignItems,
      primaryAxisAlignItems,
      layoutPositioning,
      isMask,
   } = node

   const staticNode: StaticFrameNode = {
      isMask,
      parent: parentNode,
      x,
      y,

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
      imageFillMeta: await getImageFillMeta(fills as ReadonlyArray<Paint>),
      layoutMode,
      itemSpacing,
      paddingLeft,
      paddingTop,
      paddingRight,
      paddingBottom,
      counterAxisAlignItems,
      primaryAxisAlignItems,
      layoutPositioning,
   }

   staticNode.children = (
      await Promise.all(
         children
            // TODO: 这里要结构，否 postmessage 的时候 JSON.stringify 会超出最大调用
            .map((item) => createStaticNode(item, { ...staticNode })),
      )
   ).filter(Boolean) as StaticNode[]

   return staticNode
}

export const createStaticGroupNode = async (
   node: GroupNode,
   parentNode?: StaticContainerNode,
): Promise<StaticGroupNode> => {
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
      layoutPositioning,
      isMask,
   } = node

   const hasMask = node.children.some((item) => 'isMask' in item && item.isMask)

   const staticNode: StaticGroupNode = {
      isMask,
      parent: parentNode,
      x,
      y,
      children: [],
      id,
      type: 'group',
      hasMask,
      effects,
      width,
      height,
      rotation,
      blendMode,
      absoluteBoundingBox,
      absoluteRenderBounds,
      absoluteTransform,
      layoutPositioning,

      svgBytes: hasMask
         ? await node.exportAsync({
              format: 'SVG',
           })
         : undefined,
   }

   staticNode.children = hasMask
      ? []
      : ((
           await Promise.all(
              children
                 // TODO: 这里要结构，否 postmessage 的时候 JSON.stringify 会超出最大调用
                 .map((item) => createStaticNode(item, { ...staticNode })),
           )
        ).filter(Boolean) as StaticNode[])

   return staticNode
}

// export const createStaticSectionNode = async (
//    node: SectionNode,
//    parentNode?: StaticContainerNode,
// ): Promise<StaticSectionNode> => {
//    const {
//       id,
//       width,
//       height,
//       absoluteBoundingBox,
//       absoluteTransform,
//       children,
//       fills,
//       x,
//       y,
//    } = node

//    const staticNode: StaticSectionNode = {
//       parent: parentNode,
//       x,
//       y,
//       children: [],
//       id,
//       fills,
//       type: 'section',
//       width,
//       height,
//       absoluteTransform,
//       absoluteBoundingBox,
//       parentAbsoluteBoundingBox:
//          node.parent && 'absoluteBoundingBox' in node.parent
//             ? node.parent.absoluteBoundingBox ?? undefined
//             : undefined,
//    }

//    staticNode.children = (
//       await Promise.all(
//          children
//             // TODO: 这里要结构，否 postmessage 的时候 JSON.stringify 会超出最大调用
//             .map((item) => createStaticNode(item, { ...staticNode })),
//       )
//    ).filter(Boolean) as StaticNode[]

//    return staticNode
// }

export const createStaticNode = async (
   node: SceneNode,
   parent?: StaticContainerNode,
): Promise<StaticNode | null> => {
   if (node.visible === false) return null

   if (node.type === 'TEXT') {
      return createStaticTextNode(node, parent)
   }

   if (node.type === 'RECTANGLE') {
      return createStaticRectangleNode(node, parent)
   }

   if (node.type === 'ELLIPSE') {
      return createStaticEllipseNode(node, parent)
   }

   if (node.type === 'FRAME') {
      return createStaticFrameNode(node, parent)
   }

   if (node.type === 'GROUP') {
      return createStaticGroupNode(node, parent)
   }

   // if (node.type === 'SECTION') {
   //    return createStaticSectionNode(node, parent)
   // }

   if (node.type === 'LINE') {
      return createStaticLineNode(node, parent)
   }

   if (node.type === 'VECTOR') {
      return createStaticVectorNode(node, parent)
   }

   if (node.type === 'STAR') {
      return createStaticStarNode(node, parent)
   }

   if (node.type === 'POLYGON') {
      return createStaticPolygonNode(node, parent)
   }

   if (node.type === 'BOOLEAN_OPERATION') {
      return createStaticBooleanOperationNode(node, parent)
   }

   return null
}
