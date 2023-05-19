import { NodeTree } from '@huima/types'
import { DEFAULT_UI_HEADER_HEIGHT } from '@huima/utils'
import parsers from 'prettier/parser-html'
import prettier from 'prettier/standalone'
import Prism from 'prismjs'
import { computed, reactive, ref } from 'vue'
import {
   DEFAULT_BASE_FONT_SIZE,
   DEFAULT_PX_CONVERT_FORMAT,
   VIEWPORT_HEIGHT,
   VIEWPORT_WIDTH,
} from '../constants'
import { createHTML } from '../createHTML'
import { convertPxValueToRelative } from '../methods'

export const selectedNodeName = ref('未选择')
export const selectedNodeId = ref('未知')

export const copyBtnText = ref('复制')

export const showMode = ref<'code' | 'playground' | 'settings' | 'empty'>(
   'empty',
)
export const selectedNodeTree = ref<NodeTree | null>(null)

export const nodeMaps = ref<Record<string, NodeTree>>({})

export const hoverCodeArea = ref(false)

// 跳转 settings 前的 mode 状态
export const currentMode = ref<typeof showMode.value>(showMode.value)

export type BaseSettings = {
   uiHeaderHeight: number
   uiViewportSize: {
      width: number
      height: number
   }
   pxConvertConfigs: {
      pxConvertFormat: 'rem' | 'vw'
      viewportWidth: number
      pxConvertBaseFontSize: number
   }
}

export type Settings = BaseSettings & {
   enablePxConvert: boolean
}

export const defaultSettings = reactive<BaseSettings>({
   uiHeaderHeight: DEFAULT_UI_HEADER_HEIGHT,
   uiViewportSize: {
      width: VIEWPORT_WIDTH,
      height: VIEWPORT_HEIGHT,
   },
   pxConvertConfigs: {
      pxConvertFormat: DEFAULT_PX_CONVERT_FORMAT,
      viewportWidth: VIEWPORT_WIDTH,
      pxConvertBaseFontSize: DEFAULT_BASE_FONT_SIZE,
   },
})

export const settings = reactive<Settings>({
   ...defaultSettings,
   enablePxConvert: false,
})

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

export const baseRendererNodeHtml = computed(() => {
   if (selectedNodeTree.value) {
      return createHTML(selectedNodeTree.value, {
         convertPxValue: convertPxValueToRelative,
      })
   }
   return ''
})

export const rendererNodeHtml = computed(() => {
   // 创建一个样式字符串
   const style = `
<style>
html {
   font-size: ${settings.pxConvertConfigs.pxConvertBaseFontSize}px;
}
</style>`

   // 将样式字符串添加到 baseHtml 前面
   return `${style}${baseRendererNodeHtml.value}`
})

export const baseCopiedNodeHtml = computed(() => {
   if (selectedNodeTree.value) {
      const result = createHTML(selectedNodeTree.value, {
         getBgImgUrl(backgroundImageMeta, node) {
            return `assets/${node.nodeInfo.name}_${
               // 文件名称不能有冒号
               node.nodeInfo.id.replace(':', '-')
            }.${backgroundImageMeta.backgroundImageExtension}`
         },
         convertPxValue: convertPxValueToRelative,
      })

      return result
   }
   return ''
})

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
