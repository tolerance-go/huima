import { ImageFillMeta, StaticNode } from '@huima/types-next'

export type RuntimeEnv = 'web' | 'miniapp'

export type DSLType = 'react' | 'vue' | 'html'

export type BaseConvertSettings = {
   enableTailwindcss: boolean
   targetRuntimeEnv: RuntimeEnv
   targetRuntimeDsl: DSLType
   enablePxConvert: boolean
   pxConvertConfigs: {
      pxConvertFormat: 'rem' | 'vw'
      viewportWidth: number
      baseFontSize: number
   }
}

export type RenderNodeHooks = {
   convertBackgroundImage?: (
      url: string,
      imageFillMeta: ImageFillMeta,
      node: StaticNode,
   ) => string
}
