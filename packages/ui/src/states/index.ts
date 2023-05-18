import { NodeTree } from '@huima/types'
import parsers from 'prettier/parser-html'
import prettier from 'prettier/standalone'
import Prism from 'prismjs'
import { computed, ref } from 'vue'

export const selectedNodeName = ref('未选择')
export const selectedNodeId = ref('未知')

export const copyBtnText = ref('复制')

export const baseRendererNodeHtml = ref('')
export const showMode = ref<'code' | 'playground' | 'empty'>('empty')

export const nodeMaps = ref<Record<string, NodeTree>>({})

export const hoverCodePlayground = ref(false)

// export const showMode = ref<'code' | 'playground' | 'empty'>('code')
// export const baseRendererNodeHtml = ref(`
// <div
//   style="width: 1399px; height: 490px; position: relative; display: flex; flex-direction: row; gap: 98px; padding-left: 0px; padding-top: 0px; padding-right: 0px; padding-bottom: 0px; align-items: center; justify-content: center; border-radius: 0px;"
// >
//   <div style="width: 786px; height: 340px; position: relative;">
//     <span
//       style="width: 786px; height: 131px; position: absolute; left: 0px; top: 0px; letter-spacing: 0px; font-size: 60.880001068115234px; font-weight: 400; line-height: normal; text-align: left; vertical-align: top; color: rgba(255, 255, 255, 1); display: inline-block; text-overflow: clip; white-space: normal; overflow: visible;"
//     >
//       支持多种前端应用开发框架导出 </span
//     ><span
//       style="width: 780px; height: 131px; position: absolute; left: 0px; top: 209px; letter-spacing: 0px; font-size: 31.5px; font-weight: 400; line-height: normal; text-align: left; vertical-align: top; color: rgba(173.00000488758087, 181.0000044107437, 189.00000393390656, 1); display: inline-block; text-overflow: clip; white-space: normal; overflow: visible;"
//     >
//       支持导出 react，vue 等组件开发框架，和 vite，CRA
//       脚等手架，支持自定义脚手架静态配置和组件代码及文件组织风格
//     </span>
//   </div>
//   <div
//     style="width: 515px; height: 490px; position: relative; border-radius: 0px; background-image: url('blob:null/360e2e30-cc54-4d53-9308-627cfbe374be'); background-size: cover; background-repeat: no-repeat; background-position: center;"
//   ></div>
// </div>
// `)

export const baseCopiedNodeHtml = ref('')

// 复制到剪贴板的 html 代码
export const copiedNodeHtml = computed(() => {
   const extension = 'html'
   // 使用 Prettier 格式化代码
   const formattedCode = prettier.format(baseCopiedNodeHtml.value, {
      parser: extension,
      plugins: [parsers],
   })
   return formattedCode
})

// 展示在代码区的 html 代码
export const shownNodeHtml = computed(() => {
   const extension = 'html'
   // 使用 Prism 进行高亮
   const highlightedCode = Prism.highlight(
      copiedNodeHtml.value,
      Prism.languages[extension],
      extension,
   )

   return highlightedCode
})
