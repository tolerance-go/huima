import { ImageFillMeta, ServerNode, StaticNode } from '@huima/common/types'
export type {
   BaseConvertSettings,
   DSLType,
   RuntimeEnv,
} from '@huima/common/types'

export type RenderNodeHooks = {
   convertBackgroundImage?: (
      imageFillMeta: ImageFillMeta,
      node: StaticNode | ServerNode,
   ) => string
}
