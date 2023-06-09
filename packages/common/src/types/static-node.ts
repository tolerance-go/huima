export type StyledTextSegmentType = Pick<
   StyledTextSegment,
   | 'characters'
   | 'start'
   | 'end'
   | 'fontSize'
   | 'fontName'
   | 'fontWeight'
   | 'textDecoration'
   | 'textCase'
   | 'lineHeight'
   | 'letterSpacing'
   | 'fills'
>[]

export type Point = {
   x: number
   y: number
}

export type BaseStaticNode = {
   type: string
   id: string
   name: string
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
         | 'fills'
         | 'strokeAlign'
         | 'dashPattern'
         | 'x'
         | 'y'
         // flex 相关属性
         | 'layoutMode'
         | 'itemSpacing'
         | 'paddingLeft'
         | 'paddingTop'
         | 'paddingRight'
         | 'paddingBottom'
         | 'counterAxisAlignItems'
         | 'primaryAxisAlignItems'
         | 'layoutPositioning'
         | 'isMask'
      > {
   type: 'frame'
   cornerRadius: CornerRadiusType
   parent?: StaticContainerNode
   imageFillMeta?: ImageFillMeta
   strokeWeight: StrokeWeightType
}

export interface StaticInstanceNode
   extends BaseStaticContainerNode,
      Pick<
         InstanceNode,
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
         | 'fills'
         | 'strokeAlign'
         | 'dashPattern'
         | 'x'
         | 'y'
         // flex 相关属性
         | 'layoutMode'
         | 'itemSpacing'
         | 'paddingLeft'
         | 'paddingTop'
         | 'paddingRight'
         | 'paddingBottom'
         | 'counterAxisAlignItems'
         | 'primaryAxisAlignItems'
         | 'layoutPositioning'
         | 'isMask'
      > {
   type: 'instanceNode'
   cornerRadius: CornerRadiusType
   parent?: StaticContainerNode
   imageFillMeta?: ImageFillMeta
   strokeWeight: StrokeWeightType
}

export interface StaticComponentNode
   extends BaseStaticContainerNode,
      Pick<
         ComponentNode,
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
         | 'fills'
         | 'strokeAlign'
         | 'dashPattern'
         | 'x'
         | 'y'
         // flex 相关属性
         | 'layoutMode'
         | 'itemSpacing'
         | 'paddingLeft'
         | 'paddingTop'
         | 'paddingRight'
         | 'paddingBottom'
         | 'counterAxisAlignItems'
         | 'primaryAxisAlignItems'
         | 'layoutPositioning'
         | 'isMask'
      > {
   type: 'componentNode'
   cornerRadius: CornerRadiusType
   parent?: StaticContainerNode
   imageFillMeta?: ImageFillMeta
   strokeWeight: StrokeWeightType
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
         | 'layoutPositioning'
         | 'isMask'
      > {
   type: 'group'

   parent?: StaticContainerNode
   // 当子节点存在 mask 的时候才存在
   svgBytes?: Uint8Array
   hasMask: boolean
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

   parent?: StaticContainerNode
}

export type CornerRadiusType =
   | {
        topLeftRadius: number
        topRightRadius: number
        bottomLeftRadius: number
        bottomRightRadius: number
     }
   | number

export type StrokeWeightType =
   | {
        strokeRightWeight: number
        strokeTopWeight: number
        strokeBottomWeight: number
        strokeLeftWeight: number
     }
   | number

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
         | 'fills'
         | 'strokeAlign'
         | 'dashPattern'
         | 'x'
         | 'y'
         | 'layoutPositioning'
         | 'isMask'
      > {
   type: 'rectangle'
   cornerRadius: CornerRadiusType
   parent?: StaticContainerNode
   imageFillMeta?: ImageFillMeta
   strokeWeight: StrokeWeightType
}

export interface StaticLineNode
   extends BaseStaticNode,
      Pick<
         LineNode,
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
         | 'fills'
         | 'strokeAlign'
         | 'strokeWeight'
         | 'dashPattern'
         | 'x'
         | 'y'
         | 'layoutPositioning'
         | 'isMask'
      > {
   type: 'line'
   parent?: StaticContainerNode
   svgBytes: Uint8Array
}

export interface StaticVectorNode
   extends BaseStaticNode,
      Pick<
         VectorNode,
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
         | 'fills'
         | 'strokeAlign'
         | 'strokeWeight'
         | 'dashPattern'
         | 'x'
         | 'y'
         | 'layoutPositioning'
         | 'isMask'
      > {
   type: 'vector'
   parent?: StaticContainerNode
   svgBytes: Uint8Array
}

export interface StaticBooleanOperationNode
   extends BaseStaticNode,
      Pick<
         BooleanOperationNode,
         | 'effects'
         | 'strokes'
         | 'width'
         | 'height'
         | 'rotation'
         | 'blendMode'
         | 'absoluteBoundingBox'
         | 'absoluteRenderBounds'
         | 'absoluteTransform'
         | 'fills'
         | 'strokeAlign'
         | 'strokeWeight'
         | 'dashPattern'
         | 'x'
         | 'y'
         | 'layoutPositioning'
         | 'isMask'
      > {
   type: 'booleanOperation'
   parent?: StaticContainerNode
   svgBytes: Uint8Array
}

export interface StaticStarNode
   extends BaseStaticNode,
      Pick<
         VectorNode,
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
         | 'fills'
         | 'strokeAlign'
         | 'strokeWeight'
         | 'dashPattern'
         | 'x'
         | 'y'
         | 'layoutPositioning'
         | 'isMask'
      > {
   type: 'star'
   parent?: StaticContainerNode
   svgBytes: Uint8Array
}

export interface StaticPolygonNode
   extends BaseStaticNode,
      Pick<
         VectorNode,
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
         | 'fills'
         | 'strokeAlign'
         | 'strokeWeight'
         | 'dashPattern'
         | 'x'
         | 'y'
         | 'layoutPositioning'
         | 'isMask'
      > {
   type: 'polygon'
   parent?: StaticContainerNode
   svgBytes: Uint8Array
}

export interface StaticEllipseNode
   extends BaseStaticNode,
      Pick<
         EllipseNode,
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
         | 'layoutPositioning'
         | 'isMask'
         | 'arcData'
      > {
   type: 'ellipse'
   parent?: StaticContainerNode
   imageFillMeta?: ImageFillMeta
   svgBytes?: Uint8Array
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
         | 'layoutPositioning'
         | 'isMask'
      > {
   type: 'text'
   characters?: TextNode['characters']
   styledTextSegments: StyledTextSegmentType
   parent?: StaticContainerNode
}

export type StaticAtomNode =
   | StaticTextNode
   | StaticRectangleNode
   | StaticEllipseNode
   | StaticLineNode
   | StaticVectorNode
   | StaticStarNode
   | StaticPolygonNode
   | StaticBooleanOperationNode

export type StaticNode = StaticAtomNode | StaticContainerNode

export type StaticContainerNode =
   | StaticFrameNode
   | StaticGroupNode
   | StaticComponentNode
   | StaticInstanceNode
// | StaticSectionNode

export type ImageFillMeta = {
   imageBytes: Uint8Array
   imageByteLength: number
   imageExtension: string
}
