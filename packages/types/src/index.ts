import './global'

export type Point = {
   x: number
   y: number
}

// TODO: 设置 CSSProperty 的类型?
export type CSSStyle = Record<string, string | number | undefined | null>

export type BackgroundImageMeta = {
   backgroundImageBytes: ArrayBuffer
   backgroundImageSize: {
      width: number
      height: number
   }
   backgroundImageByteLength: number
   backgroundImageExtension: string
}
export type StyleMeta = {
   backgroundImageMeta?: BackgroundImageMeta
}

export type NonFunctionPropertyNames<T> = {
   [K in keyof T]: T[K] extends (...args: any[]) => any ? never : K
}[keyof T]

export type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>

export type NodeInfo = NonFunctionProperties<Omit<SceneNode, 'parent'>> & {
   parentsVisible: boolean
   level: number
   parentNodeInfo?: NodeInfo
}

export type Attrs = Record<string, string | number | undefined | null>

export interface DomNodeTree {
   tag: string
   style: CSSStyle
   attrs?: Attrs
   styleMeta?: StyleMeta
   children: DomNodeTree[]
   textContent?: string
   nodeInfo: NodeInfo
   element?: string
}

export type UIEvents = {
   selectionchange: {
      name: string
      id: string
   }
   startGen: {
      name: string
      id: string
      nodeTree: DomNodeTree
   }
}

export type UIAction<K extends keyof UIEvents> = {
   type: K
   payload: UIEvents[K]
}
