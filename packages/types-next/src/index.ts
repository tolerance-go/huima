import './global'

export type Point = {
   x: number
   y: number
}

export type BaseStaticNode = {
   type: string
   id: string
   children: StaticNode[]
}

export type StaticTextNode = BaseStaticNode & {
   type: 'text'
   characters?: TextNode['characters']
   id: string
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
} & Pick<
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
   >

export type StaticNode = StaticTextNode

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
