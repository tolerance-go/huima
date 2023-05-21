import { CSSStyle } from '@huima/types'

export type getSomeCSS = (
   curStyle: CSSStyle,
   ...args: any[]
) =>
   | CSSStyle
   | {
        style: CSSStyle
        styleMeta: Record<string, any>
     }
