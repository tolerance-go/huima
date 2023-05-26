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

export interface StaticFrameNode extends BaseStaticContainerNode {
   type: 'Frame'
}

export interface StaticGroupNode extends BaseStaticContainerNode {
   type: 'Group'
}

export interface StaticSectionNode extends BaseStaticContainerNode {
   type: 'Section'
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
      > {
   type: 'rectangle'
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
}

export type StaticNode = StaticTextNode | StaticRectangleNode

export type StaticContainerNode =
   | StaticFrameNode
   | StaticGroupNode
   | StaticSectionNode

export type UIEvents = {
   selectedNode: {
      // 为 null 则表示选中的节点转换失败
      staticNode: StaticNode | null
   }
}

export type UIAction<K extends keyof UIEvents> = {
   type: K
   payload: UIEvents[K]
}
