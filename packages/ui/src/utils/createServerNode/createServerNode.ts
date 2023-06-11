import {
   BaseUploadSettings,
   StaticContainerNode,
} from '@huima/common/dist/types'
import { ServerNode, StaticNode } from '@huima/render-static-node'
import { convertBooleanOperationNodeToServer } from './convertBooleanOperationNodeToServer'
import { convertComponentNodeToServer } from './convertComponentNodeToServer'
import { convertEllipseNodeToServer } from './convertEllipseNodeToServer'
import { convertFrameNodeToServer } from './convertFrameNodeToServer'
import { convertGroupNodeToServer } from './convertGroupNodeToServer'
import { convertInstanceNodeToServer } from './convertInstanceNodeToServer'
import { convertLineNodeToServer } from './convertLineNodeToServer'
import { convertPolygonNodeToServer } from './convertPolygonNodeToServer'
import { convertRectangleNodeToServer } from './convertRectangleNodeToServer'
import { convertStarNodeToServer } from './convertStarNodeToServer'
import { convertTextNodeToServer } from './convertTextNodeToServer'
import { convertVectorNodeToServer } from './convertVectorNodeToServer'
import { ServerNodeConvertHooks } from './types'

// 新建一个 createServerNode 函数，将 staticNode 转化为服务端存储的 json 数据结构，
// 同时把资源提取出来，json 中的资源替换为相应的路径

// 0. 新建一个 createServerNode 函数，将 staticNode 转化为服务端存储的 json 数据结构，
// 同时把资源提取出来，json 中的资源替换为相应的路径
// 1. 将 renderStaticNode 提取出来，因为 server 端也需要使用他
// 2. renderStaticNode 内部依赖外部环境的代码移除，比如 image 转浏览器 blob url 的逻辑，
// 相应修改 rendererCode

export const createServerNode = (
   settings: BaseUploadSettings,
   node: StaticNode,
   hooks: ServerNodeConvertHooks,
   parentNode?: StaticContainerNode,
): ServerNode => {
   const getServerNode = () => {
      switch (node.type) {
         case 'frame':
            return convertFrameNodeToServer(settings, node, hooks, parentNode)
         case 'componentNode':
            return convertComponentNodeToServer(
               settings,
               node,
               hooks,
               parentNode,
            )
         case 'instanceNode':
            return convertInstanceNodeToServer(
               settings,
               node,
               hooks,
               parentNode,
            )
         case 'group':
            return convertGroupNodeToServer(settings, node, hooks, parentNode)
         case 'text':
            return convertTextNodeToServer(settings, node, hooks, parentNode)
         case 'rectangle':
            return convertRectangleNodeToServer(
               settings,
               node,
               hooks,
               parentNode,
            )
         case 'ellipse':
            return convertEllipseNodeToServer(settings, node, hooks, parentNode)
         case 'line':
            return convertLineNodeToServer(settings, node, hooks, parentNode)
         case 'vector':
            return convertVectorNodeToServer(settings, node, hooks, parentNode)
         case 'booleanOperation':
            return convertBooleanOperationNodeToServer(
               settings,
               node,
               hooks,
               parentNode,
            )
         case 'polygon':
            return convertPolygonNodeToServer(settings, node, hooks, parentNode)
         case 'star':
            return convertStarNodeToServer(settings, node, hooks, parentNode)
         default:
            return node
      }
   }

   const serverNode = getServerNode()
   return {
      ...serverNode,
      // 服务端存储的数据结构中，不需要 parent 对象，后期可以存储一个 parentId
      parent: undefined,
   }
}
