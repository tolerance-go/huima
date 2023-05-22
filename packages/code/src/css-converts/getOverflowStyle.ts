import { removeNullOrUndefined } from '@huima/utils'
import { CSSStyle } from '../type'

export function getOverflowStyle(
   node: Pick<FrameNode, 'clipsContent'>,
): CSSStyle {
   let cssProps: CSSStyle = removeNullOrUndefined({
      overflow: node.clipsContent ? 'hidden' : undefined,
   })

   return cssProps
}
