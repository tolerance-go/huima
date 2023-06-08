import { CodeEvents } from './types'

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
