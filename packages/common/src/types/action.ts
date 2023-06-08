import { Settings } from './settings'
import { StaticNode } from './static-node'

export type CodeAction<K extends keyof CodeEvents> = {
   type: K
   payload: CodeEvents[K]
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

export type UIEvents = {
   selectedNode: {
      // 为 null 则表示选中的节点转换失败
      staticNode: StaticNode | null
   }
   initSettings: {
      settings: Settings
   }
}
