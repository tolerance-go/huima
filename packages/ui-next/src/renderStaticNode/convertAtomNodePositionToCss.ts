import {
   StaticEllipseNode,
   StaticFrameNode,
   StaticGroupNode,
   StaticRectangleNode,
} from '@huima/types-next'
import { relativePoint } from '../utils/rotatePoint'
import { computeCssAbsPosition } from './computeCssAbsPosition'

// 这个函数判断 atom 节点的定位样式
export const convertAtomNodePositionToCss = (
   node: StaticRectangleNode | StaticEllipseNode | StaticFrameNode,
   parentNode?: StaticFrameNode | StaticGroupNode,
) => {
   // 如果一路查找祖先 parent 的过程中，都是 group，并且最后一个 group 的父级是空或者是 frame 且是 autoLayout 布局
   // 这个条件下，Group 容器渲染为一个 div 元素的，需要显示绝对定位
   const getParentsGroupData = () => {
      let parent = parentNode
      while (parent) {
         if (parent.type !== 'group')
            return { isParentsGroupAndUpperIsRootOrAutoLayout: false }
         if (
            !parent.parent ||
            (parent.parent.type === 'frame' &&
               parent.parent.layoutMode !== 'NONE')
         )
            return {
               isParentsGroupAndUpperIsRootOrAutoLayout: true,
               parentsGroupParent: parent,
            }
         parent = parent.parent
      }
      return { isParentsGroupAndUpperIsRootOrAutoLayout: false }
   }

   const { isParentsGroupAndUpperIsRootOrAutoLayout, parentsGroupParent } =
      getParentsGroupData()

   return parentNode &&
      (isParentsGroupAndUpperIsRootOrAutoLayout ||
         (parentNode.type === 'frame' && parentNode.layoutMode === 'NONE') ||
         node.layoutPositioning === 'ABSOLUTE')
      ? computeCssAbsPosition({
           rotatedUpperLeft: isParentsGroupAndUpperIsRootOrAutoLayout
              ? relativePoint(
                   {
                      x: node.x,
                      y: node.y,
                   },
                   {
                      x: parentsGroupParent!.x,
                      y: parentsGroupParent!.y,
                   },
                )
              : {
                   x: node.x,
                   y: node.y,
                },
           parentAbsoluteBoundingBox: isParentsGroupAndUpperIsRootOrAutoLayout
              ? parentsGroupParent!.absoluteBoundingBox!
              : parentNode.absoluteBoundingBox!,
           absoluteBoundingBox: node.absoluteBoundingBox!,
           constraints: node.constraints,
           rotation: node.rotation,
        })
      : {}
}
