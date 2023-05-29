export type RuntimeEnv = 'web' | 'miniapp'

export type DSLType = 'react' | 'vue' | 'html'

export type BaseConvertSettings = {
   enableTailwindcss: boolean
   targetRuntimeEnv: RuntimeEnv
   targetRuntimeDsl: DSLType
}
