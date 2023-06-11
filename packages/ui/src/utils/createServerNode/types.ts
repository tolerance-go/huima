import { ImageFillMeta } from '@huima/common/dist/types'
import { StaticNode } from '@huima/render-static-node'

export type ServerNodeConvertHooks = {
   convertImageFillMetaBytesToAssertUrl: (
      imageFillMeta: ImageFillMeta,
      node: StaticNode,
   ) => string
}
