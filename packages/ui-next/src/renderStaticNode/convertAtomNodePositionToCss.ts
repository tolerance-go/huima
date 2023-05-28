import {
   StaticContainerNode,
   StaticEllipseNode,
   StaticFrameNode,
   StaticGroupNode,
   StaticRectangleNode,
} from '@huima/types-next'
import { relativePoint } from '../utils/rotatePoint'
import { computeCssAbsPosition } from './computeCssAbsPosition'

// 给我一个函数，传入一个节点，一直向上查找，直到找到第一个非 group 节点，返回这个节点和上一个 group 节点
// 一直找到头，如果没有符合条件的话返回空
const getFirstFrameNodeAndUpperGroupNode = (
   node?: StaticFrameNode | StaticGroupNode,
): {
   firstNotGroupNode: StaticFrameNode | null
   upperGroupNode: StaticGroupNode | null
} => {
   let firstNotGroupNode: StaticFrameNode | null = null
   let upperGroupNode: StaticGroupNode | null = null
   let parent = node
   while (parent) {
      if (parent.type === 'frame') {
         firstNotGroupNode = parent
         break
      }
      if (parent.type === 'group') {
         upperGroupNode = parent
      }
      parent = parent.parent as StaticFrameNode | StaticGroupNode
   }
   return { firstNotGroupNode, upperGroupNode }
}

// 这个函数判断 atom 节点的定位样式
export const convertAtomNodePositionToCss = (
   node: StaticRectangleNode | StaticEllipseNode | StaticFrameNode,
   parentNode?: StaticContainerNode,
) => {
   const { firstNotGroupNode, upperGroupNode } =
      getFirstFrameNodeAndUpperGroupNode(parentNode)

   // 1. 如果父级是 group 节点，要显示绝对定位，因为 group 会显示为 div
   const opt1 = parentNode && parentNode.type === 'group'

   // 2. 如果是父节点是空，表示自身是根节点，显示相对定位
   const opt2 = !parentNode

   // 3. 如果自身存在 layoutPositioning === 'ABSOLUTE' 属性，显示绝对定位
   const opt3 = node.layoutPositioning === 'ABSOLUTE'

   // 4. 如果父节点是 frame 且非 autoLayout 布局，显示绝对定位
   const opt4 =
      parentNode &&
      parentNode.type === 'frame' &&
      parentNode.layoutMode === 'NONE'

   return parentNode && (!opt2 || opt1 || opt3 || opt4)
      ? computeCssAbsPosition({
           // 如果父节点是 group，那么我们需要计算相对于最上一个 group 的位置
           rotatedUpperLeft: opt1
              ? relativePoint(
                   {
                      x: node.x,
                      y: node.y,
                   },
                   {
                      x: upperGroupNode!.x,
                      y: upperGroupNode!.y,
                   },
                )
              : {
                   x: node.x,
                   y: node.y,
                },
           parentAbsoluteBoundingBox: opt1
              ? upperGroupNode!.absoluteBoundingBox!
              : parentNode.absoluteBoundingBox!,
           absoluteBoundingBox: node.absoluteBoundingBox!,
           constraints: node.constraints,
           rotation: node.rotation,
        })
      : {}
}
