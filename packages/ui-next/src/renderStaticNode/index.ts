import { StaticNode } from '@huima/types-next'
import { DSLType, RuntimeEnv } from '../types'

export const renderStaticNode = (
   runtimeEnv: RuntimeEnv,
   dslType: DSLType,
   node: StaticNode,
): string => {
   if (runtimeEnv === 'web') {
      if (dslType === 'html') {
         return `<span>${node.characters ?? ''}</span>`
      }
   }

   return `环境：${runtimeEnv}，DSL 类型：${dslType}，node 类型：${node.type}，还未支持转换成静态代码`
}
