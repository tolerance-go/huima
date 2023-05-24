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
}

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
