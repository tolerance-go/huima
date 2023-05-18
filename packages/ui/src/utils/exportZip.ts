import { saveAs } from 'file-saver'
import JSZip from 'jszip'

export const exportZip = (
   data: {
      path: string
      content: string | ArrayBuffer
   }[],
   filename: string = 'files',
) => {
   const zip = new JSZip()
   data.forEach((item) => {
      zip.file(item.path, item.content)
   })
   zip.generateAsync({ type: 'blob' }).then((blob) =>
      saveAs(blob, `${filename}.zip`),
   )
}
