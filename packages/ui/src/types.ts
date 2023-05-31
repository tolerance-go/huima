import { ImageFillMeta, StaticNode } from '@huima/types'
export type { BaseConvertSettings, DSLType, RuntimeEnv } from '@huima/types'

export type RenderNodeHooks = {
   convertBackgroundImage?: (
      url: string,
      imageFillMeta: ImageFillMeta,
      node: StaticNode,
   ) => string
}
