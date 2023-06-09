import {
   ServerNode,
   StaticContainerNode,
   StaticNode,
} from '@huima/common/types'
import { convertBooleanOperationNodeToHtml } from './convert-node-to-html/convertBooleanOperationNodeToHtml'
import { convertComponentNodeToHtml } from './convert-node-to-html/convertComponentNodeToHtml'
import { convertEllipseNodeToHtml } from './convert-node-to-html/convertEllipseNodeToHtml'
import { convertFrameNodeToHtml } from './convert-node-to-html/convertFrameNodeToHtml'
import { convertGroupNodeToHtml } from './convert-node-to-html/convertGroupNodeToHtml'
import { convertInstanceNodeToHtml } from './convert-node-to-html/convertInstanceNodeToHtml'
import { convertLineNodeToHtml } from './convert-node-to-html/convertLineNodeToHtml'
import { convertPolygonNodeToHtml } from './convert-node-to-html/convertPolygonNodeToHtml'
import { convertRectangleNodeToHtml } from './convert-node-to-html/convertRectangleNodeToHtml'
import { convertStarNodeToHtml } from './convert-node-to-html/convertStarNodeToHtml'
import { convertTextNodeToHtml } from './convert-node-to-html/convertTextNodeToHtml'
import { convertVectorNodeToHtml } from './convert-node-to-html/convertVectorNodeToHtml'
import { BaseConvertSettings, RenderNodeHooks } from './types'

/**
 * 此函数根据不同的运行环境，DSL 类型，node 类型，将 node 转换成静态代码，
 * 最后渲染到运行环境中，比如浏览器环境
 */
export const renderStaticNode = (
   settings: BaseConvertSettings,
   node: StaticNode | ServerNode,
   hooks?: RenderNodeHooks,
   parentNode?: StaticContainerNode,
): string => {
   if (settings.targetRuntimeEnv === 'web') {
      if (
         settings.targetRuntimeDsl === 'html' ||
         settings.targetRuntimeDsl === 'jsx'
      ) {
         console.log(node)

         if (node.type === 'text') {
            return convertTextNodeToHtml(settings, node, parentNode)
         }

         if (node.type === 'rectangle') {
            return convertRectangleNodeToHtml(settings, node, hooks, parentNode)
         }

         if (node.type === 'ellipse') {
            return convertEllipseNodeToHtml(settings, node, hooks, parentNode)
         }

         if (node.type === 'frame') {
            return convertFrameNodeToHtml(settings, node, hooks, parentNode)
         }

         if (node.type === 'componentNode') {
            return convertComponentNodeToHtml(settings, node, hooks, parentNode)
         }

         if (node.type === 'instanceNode') {
            return convertInstanceNodeToHtml(settings, node, hooks, parentNode)
         }

         if (node.type === 'group') {
            return convertGroupNodeToHtml(settings, node, hooks, parentNode)
         }

         if (node.type === 'line') {
            return convertLineNodeToHtml(settings, node, parentNode)
         }

         if (node.type === 'vector') {
            return convertVectorNodeToHtml(settings, node, parentNode)
         }

         if (node.type === 'booleanOperation') {
            return convertBooleanOperationNodeToHtml(settings, node, parentNode)
         }

         if (node.type === 'polygon') {
            return convertPolygonNodeToHtml(settings, node, parentNode)
         }

         if (node.type === 'star') {
            return convertStarNodeToHtml(settings, node, parentNode)
         }

         return ''
      }
   }

   return `<p>Environment: ${settings.targetRuntimeEnv}, DSL Type: ${settings.targetRuntimeDsl}, Node Type: ${node.type}, not yet supported for conversion to static code.</p>`
}

export * from './types'
export { StaticNode }
