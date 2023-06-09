// 新建一个 createServerNode 函数，将 staticNode 转化为服务端存储的 json 数据结构，
// 同时把资源提取出来，json 中的资源替换为相应的路径

// 0. 新建一个 createServerNode 函数，将 staticNode 转化为服务端存储的 json 数据结构，
// 同时把资源提取出来，json 中的资源替换为相应的路径
// 1. 将 renderStaticNode 提取出来，因为 server 端也需要使用他
// 2. renderStaticNode 内部依赖外部环境的代码移除，比如 image 转浏览器 blob url 的逻辑，
// 相应修改 rendererCode

import {
   BaseUploadSettings,
   ImageFillMeta,
   ServerBooleanOperationNode,
   ServerComponentNode,
   ServerEllipseNode,
   ServerFrameNode,
   ServerGroupNode,
   ServerInstanceNode,
   ServerLineNode,
   ServerNode,
   ServerPolygonNode,
   ServerRectangleNode,
   ServerStarNode,
   ServerVectorNode,
   StaticBooleanOperationNode,
   StaticComponentNode,
   StaticContainerNode,
   StaticEllipseNode,
   StaticFrameNode,
   StaticGroupNode,
   StaticInstanceNode,
   StaticLineNode,
   StaticNode,
   StaticPolygonNode,
   StaticRectangleNode,
   StaticStarNode,
   StaticTextNode,
   StaticVectorNode,
} from '@huima/common/dist/types'

export type ServerNodeConvertHooks = {
   convertImageFillMetaBytesToAssertUrl: (
      imageBytes: ImageFillMeta,
      node: StaticNode,
   ) => string
}

export const convertFrameNodeToServer = (
   settings: BaseUploadSettings,
   node: StaticFrameNode,
   hooks: ServerNodeConvertHooks,
   parentNode?: StaticContainerNode,
): ServerFrameNode => {
   const children = node.children.map((child: StaticNode) =>
      createServerNode(settings, child, hooks, node),
   )

   if (node.imageFillMeta) {
      const src = hooks.convertImageFillMetaBytesToAssertUrl(
         node.imageFillMeta,
         node,
      )
      return {
         ...node,
         imageFillMeta: {
            ...node.imageFillMeta,
            imageBytes: new Uint8Array(0),
         },
         imageFillSrc: src,
         children,
      }
   }

   return node
}

export const convertComponentNodeToServer = (
   settings: BaseUploadSettings,
   node: StaticComponentNode,
   hooks: ServerNodeConvertHooks,
   parentNode?: StaticContainerNode,
): ServerComponentNode => {
   const children = node.children.map((child: StaticNode) =>
      createServerNode(settings, child, hooks, node),
   )
   if (node.imageFillMeta) {
      const src = hooks.convertImageFillMetaBytesToAssertUrl(
         node.imageFillMeta,
         node,
      )
      return {
         ...node,
         imageFillSrc: src,
         imageFillMeta: {
            ...node.imageFillMeta,
            imageBytes: new Uint8Array(0),
         },
         children,
      }
   }

   return node
}

export const convertInstanceNodeToServer = (
   settings: BaseUploadSettings,
   node: StaticInstanceNode,
   hooks: ServerNodeConvertHooks,
   parentNode?: StaticContainerNode,
): ServerInstanceNode => {
   const children = node.children.map((child: StaticNode) =>
      createServerNode(settings, child, hooks, node),
   )

   if (node.imageFillMeta) {
      const src = hooks.convertImageFillMetaBytesToAssertUrl(
         node.imageFillMeta,
         node,
      )
      return {
         ...node,
         imageFillSrc: src,
         imageFillMeta: {
            ...node.imageFillMeta,
            imageBytes: new Uint8Array(0),
         },
         children,
      }
   }

   return node
}

export const convertGroupNodeToServer = (
   settings: BaseUploadSettings,
   node: StaticGroupNode,
   hooks: ServerNodeConvertHooks,
   parentNode?: StaticContainerNode,
): ServerGroupNode => ({
   ...node,
   children: node.children.map((child: StaticNode) =>
      createServerNode(settings, child, hooks, node),
   ),
})

export const convertTextNodeToServer = (
   settings: BaseUploadSettings,
   node: StaticTextNode,
   hooks: ServerNodeConvertHooks,
   parentNode?: StaticContainerNode,
): StaticTextNode => node

export const convertRectangleNodeToServer = (
   settings: BaseUploadSettings,
   node: StaticRectangleNode,
   hooks: ServerNodeConvertHooks,
   parentNode?: StaticContainerNode,
): ServerRectangleNode => {
   if (node.imageFillMeta) {
      const src = hooks.convertImageFillMetaBytesToAssertUrl(
         node.imageFillMeta,
         node,
      )
      return {
         ...node,
         imageFillMeta: {
            ...node.imageFillMeta,
            imageBytes: new Uint8Array(0),
         },
         imageFillSrc: src,
      }
   }

   return node
}

export const convertEllipseNodeToServer = (
   settings: BaseUploadSettings,
   node: StaticEllipseNode,
   hooks: ServerNodeConvertHooks,
   parentNode?: StaticContainerNode,
): ServerEllipseNode => {
   if (node.imageFillMeta) {
      const src = hooks.convertImageFillMetaBytesToAssertUrl(
         node.imageFillMeta,
         node,
      )
      return {
         ...node,
         imageFillMeta: {
            ...node.imageFillMeta,
            imageBytes: new Uint8Array(0),
         },
         imageFillSrc: src,
      }
   }

   return node
}

export const convertLineNodeToServer = (
   settings: BaseUploadSettings,
   node: StaticLineNode,
   hooks: ServerNodeConvertHooks,
   parentNode?: StaticContainerNode,
): ServerLineNode => node

export const convertVectorNodeToServer = (
   settings: BaseUploadSettings,
   node: StaticVectorNode,
   hooks: ServerNodeConvertHooks,
   parentNode?: StaticContainerNode,
): ServerVectorNode => node

export const convertBooleanOperationNodeToServer = (
   settings: BaseUploadSettings,
   node: StaticBooleanOperationNode,
   hooks: ServerNodeConvertHooks,
   parentNode?: StaticContainerNode,
): ServerBooleanOperationNode => node

export const convertPolygonNodeToServer = (
   settings: BaseUploadSettings,
   node: StaticPolygonNode,
   hooks: ServerNodeConvertHooks,
   parentNode?: StaticContainerNode,
): ServerPolygonNode => node

export const convertStarNodeToServer = (
   settings: BaseUploadSettings,
   node: StaticStarNode,
   hooks: ServerNodeConvertHooks,
   parentNode?: StaticContainerNode,
): ServerStarNode => node

export const createServerNode = (
   settings: BaseUploadSettings,
   node: StaticNode,
   hooks: ServerNodeConvertHooks,
   parentNode?: StaticContainerNode,
): ServerNode => {
   switch (node.type) {
      case 'frame':
         return convertFrameNodeToServer(settings, node, hooks, parentNode)
      case 'componentNode':
         return convertComponentNodeToServer(settings, node, hooks, parentNode)
      case 'instanceNode':
         return convertInstanceNodeToServer(settings, node, hooks, parentNode)
      case 'group':
         return convertGroupNodeToServer(settings, node, hooks, parentNode)
      case 'text':
         return convertTextNodeToServer(settings, node, hooks, parentNode)
      case 'rectangle':
         return convertRectangleNodeToServer(settings, node, hooks, parentNode)
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
