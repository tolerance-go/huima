import './global'

export type CSSStyle = Record<string, string | number | undefined>

export type NonFunctionPropertyNames<T> = {
   [K in keyof T]: T[K] extends (...args: any[]) => any ? never : K
}[keyof T]

export type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>

export type NodeInfo = NonFunctionProperties<Omit<SceneNode, 'parent'>> & {
   parentsVisible: boolean
   level: number
   parentNodeInfo?: NodeInfo
}

export interface NodeTree {
   tag: string
   style: CSSStyle
   children: NodeTree[]
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
      nodeTree: NodeTree
   }
}

export type UIAction<K extends keyof UIEvents> = {
   type: K
   payload: UIEvents[K]
}
