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
   ServerTextNode,
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
         serverNode: true,
         children,
      }
   }

   return {
      ...node,
      serverNode: true,
   }
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
         serverNode: true,
         children,
      }
   }

   return {
      ...node,
      serverNode: true,
   }
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
         serverNode: true,
         children,
      }
   }

   return {
      ...node,
      serverNode: true,
   }
}

export const convertGroupNodeToServer = (
   settings: BaseUploadSettings,
   node: StaticGroupNode,
   hooks: ServerNodeConvertHooks,
   parentNode?: StaticContainerNode,
): ServerGroupNode => ({
   ...node,
   serverNode: true,
   svgStr: node.svgBytes && Buffer.from(node.svgBytes).toString(),
   children: node.children.map((child: StaticNode) =>
      createServerNode(settings, child, hooks, node),
   ),
})

export const convertTextNodeToServer = (
   settings: BaseUploadSettings,
   node: StaticTextNode,
   hooks: ServerNodeConvertHooks,
   parentNode?: StaticContainerNode,
): ServerTextNode => {
   return {
      ...node,
      serverNode: true,
   }
}

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
         serverNode: true,
      }
   }

   return {
      ...node,
      serverNode: true,
   }
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
         svgStr: node.svgBytes && Buffer.from(node.svgBytes).toString(),
      }
   }

   return {
      ...node,
      serverNode: true,
   }
}

export const convertLineNodeToServer = (
   settings: BaseUploadSettings,
   node: StaticLineNode,
   hooks: ServerNodeConvertHooks,
   parentNode?: StaticContainerNode,
): ServerLineNode => {
   return {
      ...node,
      serverNode: true,
      svgStr: Buffer.from(node.svgBytes).toString(),
   }
}

export const convertVectorNodeToServer = (
   settings: BaseUploadSettings,
   node: StaticVectorNode,
   hooks: ServerNodeConvertHooks,
   parentNode?: StaticContainerNode,
): ServerVectorNode => {
   return {
      ...node,
      serverNode: true,
   }
}

export const convertBooleanOperationNodeToServer = (
   settings: BaseUploadSettings,
   node: StaticBooleanOperationNode,
   hooks: ServerNodeConvertHooks,
   parentNode?: StaticContainerNode,
): ServerBooleanOperationNode => {
   return {
      ...node,
      serverNode: true,
      svgStr: Buffer.from(node.svgBytes).toString(),
   }
}

export const convertPolygonNodeToServer = (
   settings: BaseUploadSettings,
   node: StaticPolygonNode,
   hooks: ServerNodeConvertHooks,
   parentNode?: StaticContainerNode,
): ServerPolygonNode => {
   return {
      ...node,
      serverNode: true,
      svgStr: Buffer.from(node.svgBytes).toString(),
   }
}

export const convertStarNodeToServer = (
   settings: BaseUploadSettings,
   node: StaticStarNode,
   hooks: ServerNodeConvertHooks,
   parentNode?: StaticContainerNode,
): ServerStarNode => {
   return {
      ...node,
      serverNode: true,
      svgStr: Buffer.from(node.svgBytes).toString(),
   }
}

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
