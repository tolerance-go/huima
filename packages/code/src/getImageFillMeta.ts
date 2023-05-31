import { ImageFillMeta } from '@huima/types'
import { pluginApi } from './pluginApi'

/**
 * 这个函数接受 fills 数组，目前只处理第一个元素
 * 如果是图片，则返回 ImageFillMeta 类型对象
 */
export async function getImageFillMeta(
   fills: ReadonlyArray<Paint>,
): Promise<ImageFillMeta | undefined> {
   const fill = fills[0]
   if (fill?.type === 'IMAGE') {
      const { imageHash } = fill as ImagePaint

      if (imageHash) {
         const image = pluginApi.getImageByHash(imageHash)

         if (image) {
            const bytes = await image.getBytesAsync()

            const imageBytes = bytes

            let extension = ''
            const header = bytes.slice(0, 3)

            // Convert Uint8Array to hexadecimal
            let hex = ''
            for (let i = 0; i < header.length; i++) {
               hex += header[i].toString(16)
            }

            switch (hex) {
               case '89504e':
                  extension = 'png'
                  break
               case '474946':
                  extension = 'gif'
                  break
               case 'ffd8ff':
                  extension = 'jpg'
                  break
               default:
                  extension = 'png' // default to png if unable to determine
            }
            const imageExtension = extension

            return {
               imageBytes,
               imageByteLength: bytes.byteLength,
               imageExtension,
            }
         }
      }
   }
}
