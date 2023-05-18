import parsers from 'prettier/parser-html'
import prettier from 'prettier/standalone'
import Prism from 'prismjs'
import { computed, createApp, ref } from 'vue'

import './styles.css'

import { UIAction } from '@huima/types'
import ClipboardJS from 'clipboard'
import { createHTML } from './createHTML'

const selectedNodeName = ref('未选择')
const selectedNodeId = ref('未知')

const copyBtnText = ref('复制')

const nodeHtml = ref('')
const showMode = ref<'code' | 'playground' | 'empty'>('empty')

// const showMode = ref<'code' | 'playground' | 'empty'>('code')
// const nodeHtml = ref(`
// <div style="width: 809px; height: 394px; position: relative;">
//   <div
//     style="width: 233px; height: 81px; position: absolute; left: 0px; top: 313px; background-color: rgba(42.000001296401024, 111.00000098347664, 151.00000619888306, 1); display: flex; flex-direction: row; gap: 10px; padding-left: 28px; padding-top: 13px; padding-right: 28px; padding-bottom: 13px; align-items: center; justify-content: center; border-radius: 100px;"
//   >
//     <span
//       style="width: 126px; height: 37px; position: relative; letter-spacing: 0px; font-size: 31.5px; font-weight: 400; line-height: normal; text-align: left; vertical-align: top; color: rgba(255, 255, 255, 1); display: inline-block; text-overflow: clip; white-space: normal; overflow: visible;"
//     >
//       免费开始
//     </span>
//   </div>
//   <span
//     style="width: 788px; height: 166px; position: absolute; left: 278px; top: 349px; letter-spacing: 0px; font-size: 70.875px; font-weight: 400; line-height: normal; text-align: left; vertical-align: top; color: rgba(255, 255, 255, 1); display: inline-block; text-overflow: clip; white-space: normal; overflow: visible;"
//   >
//     设计变代码，不用调整直接用 </span
//   ><span
//     style="width: 801px; height: 74px; position: absolute; left: 278px; top: 547px; letter-spacing: 0px; font-size: 31.5px; font-weight: 400; line-height: normal; text-align: left; vertical-align: top; color: rgba(173.00000488758087, 181.0000044107437, 189.00000393390656, 1); display: inline-block; text-overflow: clip; white-space: normal; overflow: visible;"
//   >
//     绘码插件帮助您将现有设计资源导出为 UI 一致、整洁的前端应用程序代码，从 0 到
//     1 极速生成。
//   </span>
// </div>`)

const nodeHtmlWithFormat = computed(() => {
   const extension = 'html'
   // 使用 Prettier 格式化代码
   const formattedCode = prettier.format(nodeHtml.value, {
      parser: extension,
      plugins: [parsers],
   })
   return formattedCode
})

const nodeHtmlWithHighlight = computed(() => {
   const extension = 'html'
   // 使用 Prettier 格式化代码
   const formattedCode = prettier.format(nodeHtmlWithFormat.value, {
      parser: extension,
      plugins: [parsers],
   })
   // 使用 Prism 进行高亮
   const highlightedCode = Prism.highlight(
      formattedCode,
      Prism.languages[extension],
      extension,
   )

   return highlightedCode
})

const clipboard = new ClipboardJS('#copyBtn', {
   text: () => {
      return nodeHtmlWithFormat.value
   },
})

clipboard.on('success', function (e) {
   console.log('Text copied to clipboard')
   e.clearSelection()
   copyBtnText.value = '复制成功!'

   setTimeout(() => {
      copyBtnText.value = '复制'
   }, 1500)
})

clipboard.on('error', function (e) {
   console.error('Failed to copy text')
})

const handleGenCode = () => {
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

const handleShowCodeBtnClick = () => {
   showMode.value = 'code'
}

const handleShowPlaygroundBtnClick = () => {
   showMode.value = 'playground'
}

createApp({
   setup() {
      return {
         selectedNodeName,
         selectedNodeId,
         nodeHtml,
         handleGenCode,
         handleShowCodeBtnClick,
         handleShowPlaygroundBtnClick,
         copyBtnText,
         showMode,
         nodeHtmlWithHighlight,
      }
   },
}).mount('#app')

onmessage = (event) => {
   if (process.env.WEBPACK_SERVE) {
      return
   }

   if (event.data.pluginMessage.type === 'startGen') {
      const {
         payload: { name, id, nodeTree },
      } = event.data.pluginMessage as UIAction<'startGen'>
      const html = createHTML(nodeTree)
      selectedNodeName.value = name
      selectedNodeId.value = id
      nodeHtml.value = html
      showMode.value = 'playground'
      return
   }

   if (event.data.pluginMessage.type === 'selectionchange') {
      const {
         payload: { name, id },
      } = event.data.pluginMessage as UIAction<'selectionchange'>
      selectedNodeName.value = name
      selectedNodeId.value = id
      nodeHtml.value = ''
      showMode.value = 'empty'
      return
   }
}
