import { ImageFillMeta, StaticNode } from '@huima/types-next'
export type {
   BaseConvertSettings,
   DSLType,
   RuntimeEnv,
} from '@huima/types-next'

export type RenderNodeHooks = {
   convertBackgroundImage?: (
      url: string,
      imageFillMeta: ImageFillMeta,
      node: StaticNode,
   ) => string
}
