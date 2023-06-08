import { ImageFillMeta, StaticNode } from '@huima/common'
export type { BaseConvertSettings, DSLType, RuntimeEnv } from '@huima/common'

export type RenderNodeHooks = {
   convertBackgroundImage?: (
      imageFillMeta: ImageFillMeta,
      node: StaticNode,
   ) => string
}
