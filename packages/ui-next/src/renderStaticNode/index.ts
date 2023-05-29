import { StaticContainerNode, StaticNode } from '@huima/types-next'
import { DSLType, RuntimeEnv } from '../types'
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
   runtimeEnv: RuntimeEnv,
   dslType: DSLType,
   node: StaticNode,
   parentNode?: StaticContainerNode,
): string => {
   if (runtimeEnv === 'web') {
      if (dslType === 'html') {
         console.log(node)

         if (node.type === 'text') {
            const content = convertTextNodeToHtml(
               runtimeEnv,
               dslType,
               node,
               parentNode,
            )
            return content
         }

         if (node.type === 'rectangle') {
            const content = convertRectangleNodeToHtml(
               runtimeEnv,
               dslType,
               node,
               parentNode,
            )
            return content
         }

         if (node.type === 'ellipse') {
            const content = convertEllipseNodeToHtml(
               runtimeEnv,
               dslType,
               node,
               parentNode,
            )
            return content
         }

         if (node.type === 'frame') {
            const content = convertFrameNodeToHtml(
               runtimeEnv,
               dslType,
               node,
               parentNode,
            )
            return content
         }

         if (node.type === 'componentNode') {
            const content = convertComponentNodeToHtml(
               runtimeEnv,
               dslType,
               node,
               parentNode,
            )
            return content
         }

         if (node.type === 'instanceNode') {
            const content = convertInstanceNodeToHtml(
               runtimeEnv,
               dslType,
               node,
               parentNode,
            )
            return content
         }

         if (node.type === 'group') {
            const content = convertGroupNodeToHtml(
               runtimeEnv,
               dslType,
               node,
               parentNode,
            )
            return content
         }

         if (node.type === 'line') {
            const content = convertLineNodeToHtml(
               runtimeEnv,
               dslType,
               node,
               parentNode,
            )
            return content
         }

         if (node.type === 'vector') {
            const content = convertVectorNodeToHtml(
               runtimeEnv,
               dslType,
               node,
               parentNode,
            )
            return content
         }

         if (node.type === 'booleanOperation') {
            const content = convertBooleanOperationNodeToHtml(
               runtimeEnv,
               dslType,
               node,
               parentNode,
            )
            return content
         }

         if (node.type === 'polygon') {
            const content = convertPolygonNodeToHtml(
               runtimeEnv,
               dslType,
               node,
               parentNode,
            )
            return content
         }

         if (node.type === 'star') {
            const content = convertStarNodeToHtml(
               runtimeEnv,
               dslType,
               node,
               parentNode,
            )
            return content
         }

         return ''
      }
   }

   return `环境：${runtimeEnv}，DSL 类型：${dslType}，node 类型：${node.type}，还未支持转换成静态代码`
}
