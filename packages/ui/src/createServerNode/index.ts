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
   ServerContainerNode,
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
} from '@huima/common'

export type ServerNodeConvertHooks = {
   convertImageFillMetaBytesToAssertUrl: (
      imageBytes: ImageFillMeta,
      node: StaticNode,
   ) => string
}

function handleImageFillMeta<T extends StaticNode>(
   node: T,
   hooks: ServerNodeConvertHooks,
): T {
   if ('imageFillMeta' in node && node.imageFillMeta) {
      const { imageBytes, ...rest } = node.imageFillMeta
      return {
         ...node,
         imageFillMeta: {
            ...rest,
            imageSrc: hooks.convertImageFillMetaBytesToAssertUrl(
               node.imageFillMeta,
               node,
            ),
         },
      } as T
   }

   return node
}

export const convertFrameNodeToServer = (
   settings: BaseUploadSettings,
   node: StaticFrameNode,
   hooks: ServerNodeConvertHooks,
   parentNode?: ServerContainerNode,
): ServerFrameNode => {
   const children = node.children.map((child: StaticNode) =>
      createServerNode(settings, child, hooks, node),
   )
   const updatedNode = handleImageFillMeta(node, hooks)
   return { ...updatedNode, children }
}

export const convertComponentNodeToServer = (
   settings: BaseUploadSettings,
   node: StaticComponentNode,
   hooks: ServerNodeConvertHooks,
   parentNode?: ServerContainerNode,
): ServerComponentNode => {
   const children = node.children.map((child: StaticNode) =>
      createServerNode(settings, child, hooks, node),
   )
   const updatedNode = handleImageFillMeta(node, hooks)
   return { ...updatedNode, children }
}

export const convertInstanceNodeToServer = (
   settings: BaseUploadSettings,
   node: StaticInstanceNode,
   hooks: ServerNodeConvertHooks,
   parentNode?: ServerContainerNode,
): ServerInstanceNode => {
   const children = node.children.map((child: StaticNode) =>
      createServerNode(settings, child, hooks, node),
   )

   const updatedNode = handleImageFillMeta(node, hooks)
   return { ...updatedNode, children }
}

export const convertGroupNodeToServer = (
   settings: BaseUploadSettings,
   node: StaticGroupNode,
   hooks: ServerNodeConvertHooks,
   parentNode?: ServerContainerNode,
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
   parentNode?: ServerContainerNode,
): StaticTextNode => node

export const convertRectangleNodeToServer = (
   settings: BaseUploadSettings,
   node: StaticRectangleNode,
   hooks: ServerNodeConvertHooks,
   parentNode?: ServerContainerNode,
): ServerRectangleNode => {
   return handleImageFillMeta(node, hooks)
}

export const convertEllipseNodeToServer = (
   settings: BaseUploadSettings,
   node: StaticEllipseNode,
   hooks: ServerNodeConvertHooks,
   parentNode?: ServerContainerNode,
): ServerEllipseNode => {
   return handleImageFillMeta(node, hooks)
}

export const convertLineNodeToServer = (
   settings: BaseUploadSettings,
   node: StaticLineNode,
   hooks: ServerNodeConvertHooks,
   parentNode?: ServerContainerNode,
): ServerLineNode => node

export const convertVectorNodeToServer = (
   settings: BaseUploadSettings,
   node: StaticVectorNode,
   hooks: ServerNodeConvertHooks,
   parentNode?: ServerContainerNode,
): ServerVectorNode => node

export const convertBooleanOperationNodeToServer = (
   settings: BaseUploadSettings,
   node: StaticBooleanOperationNode,
   hooks: ServerNodeConvertHooks,
   parentNode?: ServerContainerNode,
): ServerBooleanOperationNode => node

export const convertPolygonNodeToServer = (
   settings: BaseUploadSettings,
   node: StaticPolygonNode,
   hooks: ServerNodeConvertHooks,
   parentNode?: ServerContainerNode,
): ServerPolygonNode => node

export const convertStarNodeToServer = (
   settings: BaseUploadSettings,
   node: StaticStarNode,
   hooks: ServerNodeConvertHooks,
   parentNode?: ServerContainerNode,
): ServerStarNode => node

export const createServerNode = (
   settings: BaseUploadSettings,
   node: StaticNode,
   hooks: ServerNodeConvertHooks,
   parentNode?: ServerContainerNode,
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
