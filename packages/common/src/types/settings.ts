export type RuntimeEnv = 'web' | 'miniapp'

export type DSLType = 'jsx' | 'html'

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

export type BaseUploadSettings = {
   token?: string
}

export type BaseRenderSettings = {
   fontAssetUrlPlaceholders: string[]
   isPreview: boolean
   token?: string
}

export type BaseUISettings = {
   language: 'zh-CN' | 'en-US'
   codeFontSize: number
   viewportSize: {
      width: number
      height: number
   }
}

export type Settings = BaseConvertSettings &
   BaseUISettings &
   BaseRenderSettings &
   BaseUploadSettings
