import { BaseStaticNode } from '@huima/types-next'

/**
 * 这个函数接受 SceneNode 然后返回 BaseStaticNode 数据，每一个
 * createStaticNode 都会调用这个函数，公共的属性提取就用这个函数
 */
export const getBaseStaticNodeData = (
   node: SceneNode,
): Pick<BaseStaticNode, 'id' | 'name'> => {
   const { id, name } = node

   return {
      id,
      name,
   }
}
