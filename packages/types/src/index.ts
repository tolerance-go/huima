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
   svgBytes?: Uint8Array
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

export type RuntimeEnv = 'web' | 'miniapp'

export type DSLType = 'jsx' | 'html'

export type BaseConvertSettings = {
   enableTailwindcss: boolean
   targetRuntimeEnv: RuntimeEnv
   targetRuntimeDsl: DSLType
   enablePxConvert: boolean
   pxConvertConfigs: {
      pxConvertFormat: 'rem' | 'vw'
      viewportWidth: number
      baseFontSize: number
   }
}

export type BaseUploadSettings = {
   token?: string
}

export type BaseRenderSettings = {
   fontAssetUrlPlaceholders: string[]
   isPreview: boolean
   token?: string
}

export type BaseUISettings = {
   language: 'zh-CN' | 'en-US'
   codeFontSize: number
   viewportSize: {
      width: number
      height: number
   }
}

export type Settings = BaseConvertSettings &
   BaseUISettings &
   BaseRenderSettings &
   BaseUploadSettings

export type UIEvents = {
   selectedNode: {
      // 为 null 则表示选中的节点转换失败
      staticNode: StaticNode | null
   }
   initSettings: {
      settings: Settings
   }
}

export type UIAction<K extends keyof UIEvents> = {
   type: K
   payload: UIEvents[K]
}

export type CodeEvents = {
   updateSettings: Settings
   resize: {
      width: number
      height: number
   }
}

export type CodeAction<K extends keyof CodeEvents> = {
   type: K
   payload: CodeEvents[K]
}

export const postActionToCode = <T extends keyof CodeEvents>(
   type: T,
   payload: CodeEvents[T],
) => {
   /**
    * 这个错误消息意味着你正在试图从 Figma 插件的用户界面(UI)发送一条消息，但是这条消息没有包含 pluginMessage 或者 pluginDrop 字段。在 Figma 插件中，所有从 UI 发送到主插件代码的消息都必须包含这两个字段中的一个。
pluginMessage 字段应该包含你想要发送的消息内容，而 pluginDrop 字段则用于处理用户将文件拖拽到插件窗口的事件。

你在使用 postMessage 方法向另一个窗口发送消息时遇到了这个问题。这个错误的原因在于，你试图发送消息到的窗口（在这种情况下是 https://www.figma.com）和你所提供的目标源（'null'）不匹配。
但是在Figma插件的环境中，你通常使用 '*' 作为目标源参数：
    */
   parent.postMessage(
      {
         pluginMessage: {
            type,
            payload,
         },
      },
      '*',
   )
}
