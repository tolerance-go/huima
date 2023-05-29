import { StaticContainerNode, StaticNode } from '@huima/types-next'
import { BaseConvertSettings, RenderNodeHooks } from '../types'
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

/**
 * 此函数根据不同的运行环境，DSL 类型，node 类型，将 node 转换成静态代码，
 * 最后渲染到运行环境中，比如浏览器环境
 */
export const renderStaticNode = (
   settings: BaseConvertSettings,
   node: StaticNode,
   parentNode?: StaticContainerNode,
   hooks?: RenderNodeHooks,
): string => {
   if (settings.targetRuntimeEnv === 'web') {
      if (settings.targetRuntimeDsl === 'html') {
         console.log(node)

         if (node.type === 'text') {
            const content = convertTextNodeToHtml(settings, node, parentNode)
            return content
         }

         if (node.type === 'rectangle') {
            const content = convertRectangleNodeToHtml(
               settings,
               node,
               parentNode,
               hooks,
            )
            return content
         }

         if (node.type === 'ellipse') {
            const content = convertEllipseNodeToHtml(
               settings,
               node,
               parentNode,
               hooks,
            )
            return content
         }

         if (node.type === 'frame') {
            const content = convertFrameNodeToHtml(
               settings,
               node,
               parentNode,
               hooks,
            )
            return content
         }

         if (node.type === 'componentNode') {
            const content = convertComponentNodeToHtml(
               settings,
               node,
               parentNode,
               hooks,
            )
            return content
         }

         if (node.type === 'instanceNode') {
            const content = convertInstanceNodeToHtml(
               settings,
               node,
               parentNode,
               hooks,
            )
            return content
         }

         if (node.type === 'group') {
            const content = convertGroupNodeToHtml(
               settings,
               node,
               parentNode,
               hooks,
            )
            return content
         }

         if (node.type === 'line') {
            const content = convertLineNodeToHtml(settings, node, parentNode)
            return content
         }

         if (node.type === 'vector') {
            const content = convertVectorNodeToHtml(settings, node, parentNode)
            return content
         }

         if (node.type === 'booleanOperation') {
            const content = convertBooleanOperationNodeToHtml(
               settings,
               node,
               parentNode,
            )
            return content
         }

         if (node.type === 'polygon') {
            const content = convertPolygonNodeToHtml(settings, node, parentNode)
            return content
         }

         if (node.type === 'star') {
            const content = convertStarNodeToHtml(settings, node, parentNode)
            return content
         }

         return ''
      }
   }

   return `<p>Environment: ${settings.targetRuntimeEnv}, DSL Type: ${settings.targetRuntimeDsl}, Node Type: ${node.type}, not yet supported for conversion to static code.</p>`
}
