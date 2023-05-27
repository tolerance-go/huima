import './global'

export type Point = {
   x: number
   y: number
}

export type BaseStaticNode = {
   type: string
   id: string
}

export interface BaseStaticContainerNode extends BaseStaticNode {
   children: StaticNode[]
}

export interface StaticFrameNode
   extends BaseStaticContainerNode,
      Pick<
         FrameNode,
         | 'effects'
         | 'strokes'
         | 'constraints'
         | 'width'
         | 'height'
         | 'rotation'
         | 'blendMode'
         | 'absoluteBoundingBox'
         | 'absoluteRenderBounds'
         | 'absoluteTransform'
         | 'cornerRadius'
         | 'fills'
         | 'strokeAlign'
         | 'strokeWeight'
         | 'dashPattern'
         | 'x'
         | 'y'
      > {
   type: 'frame'
   parentAbsoluteBoundingBox?: Rect
   parent?: StaticContainerNode
}

export interface StaticGroupNode
   extends BaseStaticContainerNode,
      Pick<
         GroupNode,
         | 'effects'
         | 'width'
         | 'height'
         | 'rotation'
         | 'blendMode'
         | 'absoluteBoundingBox'
         | 'absoluteRenderBounds'
         | 'absoluteTransform'
         | 'x'
         | 'y'
      > {
   type: 'group'
   parentAbsoluteBoundingBox?: Rect
   parent?: StaticContainerNode
}

export interface StaticSectionNode
   extends BaseStaticContainerNode,
      Pick<
         SectionNode,
         | 'width'
         | 'height'
         | 'absoluteTransform'
         | 'absoluteBoundingBox'
         | 'fills'
         | 'x'
         | 'y'
      > {
   type: 'section'
   parentAbsoluteBoundingBox?: Rect
   parent?: StaticContainerNode
}

export interface StaticRectangleNode
   extends BaseStaticNode,
      Pick<
         RectangleNode,
         | 'effects'
         | 'strokes'
         | 'constraints'
         | 'width'
         | 'height'
         | 'rotation'
         | 'blendMode'
         | 'absoluteBoundingBox'
         | 'absoluteRenderBounds'
         | 'absoluteTransform'
         | 'cornerRadius'
         | 'fills'
         | 'strokeAlign'
         | 'strokeWeight'
         | 'dashPattern'
         | 'x'
         | 'y'
      > {
   type: 'rectangle'
   parentAbsoluteBoundingBox?: Rect
   parent?: StaticContainerNode
}

export interface StaticTextNode
   extends BaseStaticNode,
      Pick<
         TextNode,
         | 'paragraphSpacing'
         | 'textAutoResize'
         | 'textAlignHorizontal'
         | 'textAlignVertical'
         | 'effects'
         | 'strokes'
         | 'constraints'
         | 'width'
         | 'height'
         | 'rotation'
         | 'blendMode'
         | 'absoluteBoundingBox'
         | 'absoluteRenderBounds'
         | 'absoluteTransform'
         | 'x'
         | 'y'
      > {
   type: 'text'
   characters?: TextNode['characters']
   parentAbsoluteBoundingBox?: Rect
   styledCharacters: Array<
      Pick<
         StyledTextSegment,
         | 'fontSize'
         | 'fontWeight'
         | 'fontName'
         | 'fills'
         | 'textCase'
         | 'lineHeight'
         | 'letterSpacing'
         | 'textDecoration'
      > & {
         start: number
         end: number
         char: string
      }
   >
   styledTextSegments: Array<
      Pick<
         StyledTextSegment,
         | 'fontSize'
         | 'fontWeight'
         | 'fontName'
         | 'fills'
         | 'textCase'
         | 'lineHeight'
         | 'letterSpacing'
         | 'textDecoration'
      >
   >
   parent?: StaticContainerNode
}

export type StaticAtomNode = StaticTextNode | StaticRectangleNode

export type StaticNode = StaticAtomNode | StaticContainerNode

export type StaticContainerNode =
   | StaticFrameNode
   | StaticGroupNode
   | StaticSectionNode

export type UIEvents = {
   selectedNode: {
      // 为 null 则表示选中的节点转换失败
      staticNode: StaticAtomNode | null
   }
}

export type UIAction<K extends keyof UIEvents> = {
   type: K
   payload: UIEvents[K]
}
