import {
   BaseUploadSettings,
   ServerTextNode,
   StaticContainerNode,
   StaticTextNode,
} from '@huima/common/dist/types'
import { ServerNodeConvertHooks } from './types'

export const convertTextNodeToServer = (
   settings: BaseUploadSettings,
   node: StaticTextNode,
   hooks: ServerNodeConvertHooks,
   parentNode?: StaticContainerNode,
): ServerTextNode => {
   return {
      ...node,
      serverNode: true,
   }
}
