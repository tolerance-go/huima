import { isJsDesign, pluginApi } from '../pluginApi'
import { CSSStyle, StyleMeta } from '../type'

export async function generateBackgroundImageCSS(
   paints: readonly Paint[] | symbol,
): Promise<{ style: CSSStyle; styleMeta: StyleMeta }> {
   let style: CSSStyle = {}
   let styleMeta: StyleMeta = {}

   if (Array.isArray(paints)) {
      //NOTE - 注意是倒序
      const paint = [...(paints as readonly Paint[])]
         .reverse()
         .find(
            (item) => item.visible && item.type === 'IMAGE' && item.imageHash,
         ) as ImagePaint

      if (paint?.imageHash) {
         const image = pluginApi.getImageByHash(paint.imageHash)
         if (image) {
            const bytes = await image.getBytesAsync()
            // 必须在获取 bytes 之后才能获取 size
            const size = isJsDesign
               ? { width: 0, height: 0 }
               : await image.getSizeAsync()
            // JSON.stringify 传输会丢失 buffer，这里用最原始的 buffer 传输
            const backgroundImageBytes = bytes
            const backgroundImageSize = size

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
            const backgroundImageExtension = extension

            styleMeta['backgroundImageMeta'] = {
               backgroundImageBytes,
               backgroundImageSize,
               backgroundImageByteLength: bytes.byteLength,
               backgroundImageExtension,
            }

            style['background-image'] = `url('')`
            style['background-size'] = 'cover'
            style['background-repeat'] = 'no-repeat'
            style['background-position'] = 'center'
         }
      }
   }

   return { style, styleMeta }
}
