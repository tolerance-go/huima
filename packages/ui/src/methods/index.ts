import { copiedNodeHtml, showMode } from '../states'
import { exportZip } from '../utils/exportZip'

export const handleGenCode = () => {
   console.log('handleGenCode')

   parent.postMessage(
      {
         pluginMessage: {
            type: 'genCode',
         },
      },
      '*',
   )
}

export const handleShowCodeBtnClick = () => {
   showMode.value = 'code'
}

export const handleShowPlaygroundBtnClick = () => {
   showMode.value = 'playground'
}

// 处理导出按钮点击事件
export const handleExportBtnClick = () => {
   exportZip([
      {
         path: 'index.html',
         content: copiedNodeHtml.value,
      },
   ])
}
