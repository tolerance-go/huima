import { CornerRadiusType } from '@huima/common/dist/types'
import { pluginApi } from './pluginApi'

/**
 * 传入 node，如果 cornerRadius 是 mixed，返回一个对象，包含
 * topLeftRadius, topRightRadius, bottomLeftRadius, bottomRightRadius，否则返回 cornerRadius
 */
export function getCornerRadius(
   node: RectangleNode | FrameNode | InstanceNode | ComponentNode,
): CornerRadiusType {
   if (node.cornerRadius === pluginApi.mixed) {
      return {
         topLeftRadius: node.topLeftRadius,
         topRightRadius: node.topRightRadius,
         bottomLeftRadius: node.bottomLeftRadius,
         bottomRightRadius: node.bottomRightRadius,
      }
   } else {
      return node.cornerRadius
   }
}
