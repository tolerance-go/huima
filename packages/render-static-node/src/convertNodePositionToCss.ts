import {
   ServerContainerNode,
   StaticContainerNode,
   StaticGroupNode,
   StaticNode,
} from '@huima/common/dist/types'
import { computePositionCss } from './computePositionCss'
import { BaseConvertSettings } from './types'

// 给我一个函数，传入一个节点，一直向上查找，直到找到第一个非 group 节点，返回这个节点和上一个 group 节点
// 一直找到头，如果没有符合条件的话返回空
const getUpperGroupNode = (
   node?: StaticContainerNode | ServerContainerNode,
) => {
   let upperGroupNode: StaticGroupNode | null = null
   let parent = node
   while (parent) {
      if (parent.type !== 'group') {
         break
      }
      if (parent.type === 'group') {
         upperGroupNode = parent
      }
      parent = parent.parent as StaticContainerNode | ServerContainerNode
   }
   return upperGroupNode
}

// 这个函数用来判断一个节点是否需要显示绝对定位
export const convertNodePositionToCss = (
   settings: BaseConvertSettings,
   node: StaticNode,
   parentNode?: StaticContainerNode,
) => {
   const upperGroupNode = getUpperGroupNode(parentNode)

   // 1. 如果父级是 group 节点，要显示绝对定位，因为 group 会显示为 div
   // 自身如果是 group，且父节点是 group，那么不需要显示定位，因为不渲染
   const opt1 =
      node.type !== 'group' && parentNode && parentNode.type === 'group'

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
      ? computePositionCss({
           settings,
           parentBox: opt1
              ? upperGroupNode!.absoluteBoundingBox!
              : parentNode.absoluteBoundingBox!,
           nodeBox:
              node.type === 'vector' ||
              node.type === 'booleanOperation' ||
              node.type === 'line' ||
              node.type === 'polygon' ||
              node.type === 'star' ||
              (node.type === 'group' &&
                 node.children.some((item) => item.isMask))
                 ? node.absoluteRenderBounds!
                 : node.absoluteBoundingBox!,
           constraints:
              node.type === 'group' || node.type === 'booleanOperation'
                 ? {
                      horizontal: 'MIN',
                      vertical: 'MIN',
                   }
                 : node.constraints,
        })
      : {}
}
