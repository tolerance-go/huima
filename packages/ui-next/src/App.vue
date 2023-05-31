<script setup lang="ts">
import {
   BaseConvertSettings,
   BaseRenderSettings,
   BaseUISettings,
   ImageFillMeta,
   StaticNode,
   Settings,
   UIAction,
   postActionToCode,
} from '@huima/types-next'
import {
   DEFAULT_BASE_FONT_SIZE,
   DEFAULT_VIEWPORT_HEIGHT,
   DEFAULT_VIEWPORT_WIDTH,
   MIN_VIEWPORT_LENGTH,
} from '@huima/utils'
import ClipboardJS from 'clipboard'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import parserHtml from 'prettier/parser-html'
import parserBabel from 'prettier/parser-babel'
import prettier from 'prettier/standalone'
import Prism from 'prismjs'
import { computed, reactive, ref, watch, watchEffect } from 'vue'
import { normalizeCss } from './constants/normalize.css'
import { isJsDesign } from './env'
import { renderStaticNode } from './renderStaticNode'
import {
   convertFigmaIdToHtmlId,
   convertHtmlIdToFigmaId,
} from './utils/convertFigmaIdToHtmlId'
import { extractAndSplitBgImgUrls } from './utils/extractAndSplitBgImgUrls'
import { getScriptStr } from './utils/getScriptStr'
import { transformBlobUrlToAssetsUrl } from './utils/transformBlobUrlToAssetsUrl'
import { convertHtmlToJsx } from './utils/convertHtmlToJsx'

const i18n = reactive({
   'zh-CN': {
      generate: '生成',
      pleaseSelect: '“请选择场景元素后，点击生成按钮”',
      exportBtnText: '导出',
      enableCssToTailwindCss: '启用 CSS 转 Tailwindcss',
      basicFontSize: '基础字号大小',
      designDraftViewportWidth: '设计稿视口宽度',
      targetFormat: '目标格式',
      enablePxUnitConversion: '启用 px 单位转换',
      exportLabel: '导出',
      uiSettingsLabel: '界面',
      sysSettingsLabel: '系统',
      viewportHeightLabel: '视口高度（不包括头部）',
      viewportWidthLabel: '视口宽度',
      basicsLabel: '基础',
      configureLabel: '设置',
      copyBtnText: '复制',
      copySuccessBtnText: '复制成功!',
      miniProgram: '小程序',
      preview: '预览',
      theCurrentNodeDoesNotSupportRendering: '当前节点不支持渲染',
      addFont: '添加字体',
      addFontTitle: '字体',
      resourceAddress: '资源地址',
      continueAdding: '继续添加',
      tailwindcssLabel: '启用 Tailwindcss',
      codeFontSizeLabel: '代码字体大小',
      viewportSizeLabel: '视口宽高',
      languageLabel: '语言',
   },
   'en-US': {
      languageLabel: 'Language',
      viewportSizeLabel: 'Viewport width and height',
      codeFontSizeLabel: 'Code font-size',
      tailwindcssLabel: 'Enable Tailwindcss',
      sysSettingsLabel: 'system',
      addFont: 'Add font',
      addFontTitle: 'Font',
      resourceAddress: 'Resource address',
      continueAdding: 'Continue adding',
      miniProgram: 'Miniapp',
      generate: 'Generate',
      pleaseSelect:
         '"Please select the scene elements first, then click the Generate button"',
      exportBtnText: 'Export',
      enableCssToTailwindCss: 'Enable CSS to Tailwindcss conversion',
      basicFontSize: 'Basic font size',
      designDraftViewportWidth: 'Design draft viewport width',
      targetFormat: 'Target format',
      enablePxUnitConversion: 'Enable px unit conversion',
      exportLabel: 'Export',
      uiSettingsLabel: 'UI',
      viewportHeightLabel: 'Viewport height (excluding header)',
      viewportWidthLabel: 'Viewport width',
      basicsLabel: 'Basics',
      configureLabel: 'Settings',
      copyBtnText: 'Copy',
      copySuccessBtnText: 'Copy successful!',
      preview: 'Preview',
      theCurrentNodeDoesNotSupportRendering:
         'Rendering not supported on current node.',
   },
})

const usedI18n = computed(() => {
   // if (isJsDesign) {
   //    return i18n['zh-CN']
   // }
   // return i18n['en-US']
   return i18n[settings.value.language]
})

const selectedNode = ref<StaticNode | null>(null)

const notSupport = ref(false)

const baseRenderSettings: BaseRenderSettings = {
   fontAssetUrlPlaceholders: [''],
   isPreview: false,
}

const baseUISettings: BaseUISettings = {
   language: isJsDesign ? 'zh-CN' : 'en-US',
   codeFontSize: 16,
   viewportSize: {
      width: DEFAULT_VIEWPORT_WIDTH,
      height: DEFAULT_VIEWPORT_HEIGHT,
   },
}

const baseConvertSettings: BaseConvertSettings = {
   enableTailwindcss: false,
   targetRuntimeEnv: 'web',
   targetRuntimeDsl: 'html',
   enablePxConvert: false,
   pxConvertConfigs: {
      pxConvertFormat: 'rem',
      viewportWidth: DEFAULT_VIEWPORT_WIDTH,
      baseFontSize: DEFAULT_BASE_FONT_SIZE,
   },
}

const defaultSettings = {
   ...baseRenderSettings,
   ...baseUISettings,
   ...baseConvertSettings,
}

const getDefaultSettings = (): Settings => {
   return JSON.parse(JSON.stringify(defaultSettings))
}

const formSettings = reactive(getDefaultSettings())

const settings = computed(() => {
   const fonts = formSettings.fontAssetUrlPlaceholders.filter(Boolean)
   return {
      ...formSettings,
      fontAssetUrlPlaceholders: fonts.length ? fonts : [''],
      viewportSize: {
         width: formSettings.viewportSize.width || DEFAULT_VIEWPORT_WIDTH,
         height: formSettings.viewportSize.height || DEFAULT_VIEWPORT_HEIGHT,
      },
      pxConvertConfigs: {
         ...formSettings.pxConvertConfigs,
         viewportWidth:
            formSettings.pxConvertConfigs.viewportWidth ||
            DEFAULT_VIEWPORT_WIDTH,
         baseFontSize:
            formSettings.pxConvertConfigs.baseFontSize ||
            DEFAULT_BASE_FONT_SIZE,
      },
   }
})

watch(
   () => settings,
   () => {
      postActionToCode(
         'updateSettings',
         JSON.parse(JSON.stringify(settings.value)),
      )
   },
   {
      deep: true,
   },
)

watch(
   () =>
      [
         settings.value.viewportSize.height,
         settings.value.viewportSize.width,
      ].join(''),
   () => {
      // 设置宽度和高度最小为 300
      postActionToCode('resize', {
         width: Math.max(
            settings.value.viewportSize.width,
            MIN_VIEWPORT_LENGTH,
         ),
         height: Math.max(
            settings.value.viewportSize.height,
            MIN_VIEWPORT_LENGTH,
         ),
      })
   },
)

watchEffect(() => {
   document.documentElement.style.setProperty(
      '--code-font-size',
      settings.value.codeFontSize + 'px',
   )
})

const isSettingsPage = ref(false)

// 用于渲染 iframe 的 html 代码
const rendererCode = computed(() => {
   if (!selectedNode.value) return ''

   return renderStaticNode(settings.value, selectedNode.value)
})

const imageFillMetaNodeMaps: Record<string, ImageFillMeta> = {}

// 复制到剪贴板的 html 代码
const copiedCode = computed(() => {
   if (!selectedNode.value) return ''

   const htmlCode = renderStaticNode(
      settings.value,
      selectedNode.value,
      undefined,
      {
         convertBackgroundImage: (
            url: string,
            imageFillMeta: ImageFillMeta,
            node: StaticNode,
         ) => {
            imageFillMetaNodeMaps[node.id] = imageFillMeta

            return transformBlobUrlToAssetsUrl(
               url,
               `'assets/${node.name}_${convertFigmaIdToHtmlId(node.id)}.${
                  imageFillMeta.imageExtension
               }'`,
            )
         },
      },
   )

   const extension =
      settings.value.targetRuntimeDsl === 'jsx' ? 'babel' : 'html'
   // 使用 Prettier 格式化代码
   const formattedCode = prettier.format(
      settings.value.targetRuntimeDsl === 'jsx'
         ? convertHtmlToJsx(htmlCode)
         : htmlCode,
      {
         parser: extension,
         plugins: [parserHtml, parserBabel],
      },
   )
   return formattedCode
})

// 展示在代码区的 html 代码
const codeblockCode = computed(() => {
   const extension = settings.value.targetRuntimeDsl === 'jsx' ? 'jsx' : 'html'

   // 使用 Prism 进行高亮
   const highlightedCode = Prism.highlight(
      copiedCode.value,
      Prism.languages[extension],
      extension,
   )

   return highlightedCode
})

const fontScriptStr = computed(() => {
   return settings.value.fontAssetUrlPlaceholders
      .filter(Boolean)
      .map((url) => {
         return `<link rel="stylesheet" href="${url}">`
      })
      .join('\n')
})

const rendererSrcDoc = computed(() => {
   const tailwindScript = settings.value.enableTailwindcss
      ? getScriptStr({
           src: 'https://cdn.tailwindcss.com',
           onLoad: 'handleScriptLoad()',
        })
      : ''

   // 注意 tailwindScript 要在 rendererCode.value 之前执行，否则加载资源的时候，无样式的 html 会闪烁
   // tailwindScript 加载完毕后，会监听 onload 事件，计算样式的
   return `
    <html>
      <head>
         ${fontScriptStr.value}
         ${
            settings.value.enablePxConvert &&
            settings.value.pxConvertConfigs.pxConvertFormat === 'rem'
               ? `
            <style>
               html {
                  font-size: ${settings.value.pxConvertConfigs.baseFontSize}px;
               }
            </style>
         `
               : ''
         }
         <style>
          ${normalizeCss}
         </style>
         ${getScriptStr({
            content: `
            function handleScriptLoad() {
               document.getElementById('tailwindcssLoading').remove()
            }
            `,
         })}
      </head>
      <body>
         ${
            settings.value.enableTailwindcss
               ? `<p id='tailwindcssLoading' style="text-align: center;">tailwindcss loading...</p>`
               : ''
         }
         ${tailwindScript}
         ${rendererCode.value}
      </body>
    </html>
  `
})

const exportZip = (
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

const handleExportBtnClick = () => {
   const assets = extractAndSplitBgImgUrls(copiedCode.value)
   exportZip(
      [
         {
            path: 'page/index.html',
            content: `
<link href="styles/normalize.css" rel="stylesheet">
${fontScriptStr.value}
${copiedCode.value}
            `,
         },
         {
            path: 'page/styles/normalize.css',
            content: normalizeCss,
         },
         ...assets.map((item) => {
            const imageFillMeta =
               imageFillMetaNodeMaps[convertHtmlIdToFigmaId(item.id)]

            if (!imageFillMeta) {
               console.log('imageFillMeta not found', item)
            }

            return {
               path: `page/${item.path}/${item.name}_${item.id}.${item.suffix}`,
               content: imageFillMeta?.imageBytes,
            }
         }),
      ],
      'page',
   )
}

const clipboard = new ClipboardJS('#copyBtn', {
   text: () => {
      return copiedCode.value
   },
})

// 高优先级的复制按钮文案
const highCopyBtnText = ref()

clipboard.on('success', function (e) {
   console.log('Text copied to clipboard')
   e.clearSelection()
   highCopyBtnText.value = usedI18n.value.copySuccessBtnText

   setTimeout(() => {
      highCopyBtnText.value = null
   }, 1500)
})

clipboard.on('error', function (e) {
   console.error('Failed to copy text')
})

window.onmessage = (event) => {
   console.log('ui: get message from code.js', event)
   if (process.env.WEBPACK_SERVE) {
      return
   }

   if (!event.data.pluginMessage) return

   if (event.data.pluginMessage.type === 'initSettings') {
      const {
         payload: { settings: _settings },
      } = event.data.pluginMessage as UIAction<'initSettings'>

      Object.assign(formSettings, _settings)

      return
   }

   if (event.data.pluginMessage.type === 'selectedNode') {
      const {
         payload: { staticNode },
      } = event.data.pluginMessage as UIAction<'selectedNode'>

      if (staticNode === null) {
         notSupport.value = true
         return
      }

      notSupport.value = false
      selectedNode.value = staticNode

      return
   }
}
</script>

<template>
   <div class="h-screen flex flex-col">
      <div
         class="flex-none border-b px-4 py-2 flex justify-between items-center overflow-x-auto"
      >
         <div class="flex-auto">
            <form class="mb-0">
               <div class="flex space-x-1">
                  <select
                     class="w-1/4 min-w-max"
                     placeholder="选择运行环境"
                     v-model="formSettings.targetRuntimeEnv"
                  >
                     <option value="web">Web</option>
                     <!-- <option value="miniapp">{{ usedI18n.miniProgram }}</option> -->
                  </select>
                  <select
                     class="w-1/4 min-w-max"
                     placeholder="DSL"
                     v-model="formSettings.targetRuntimeDsl"
                  >
                     <option value="html">HTML</option>
                     <option value="jsx">JSX</option>
                     <!-- <option value="vue">Vue</option> -->
                  </select>
               </div>
            </form>
         </div>
         <label class="relative inline-flex items-center mx-4 cursor-pointer">
            <input
               type="checkbox"
               v-model="formSettings.isPreview"
               class="sr-only peer"
            />
            <div
               class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"
            ></div>
            <span class="ml-2 text-sm font-medium">{{ usedI18n.preview }}</span>
         </label>
         <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6 cursor-pointer min-w-min"
            role="back"
            v-if="isSettingsPage"
            @click="isSettingsPage = false"
         >
            <path
               stroke-linecap="round"
               stroke-linejoin="round"
               d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
            />
         </svg>
         <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6 cursor-pointer min-w-min"
            role="settings"
            v-if="!isSettingsPage"
            @click="isSettingsPage = true"
         >
            <path
               stroke-linecap="round"
               stroke-linejoin="round"
               d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
            />
            <path
               stroke-linecap="round"
               stroke-linejoin="round"
               d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
         </svg>
      </div>
      <div class="flex-auto overflow-auto">
         <!-- 配置渲染优先级最高 -->
         <div class="p-5" v-if="isSettingsPage">
            <h2 class="text-lg">
               {{ usedI18n.configureLabel }}
            </h2>
            <div role="settings-page" class="grid grid-cols-1 gap-6 mt-3">
               <h3 class="text-gray-700 text-sm mt-4 -mb-1">
                  {{ usedI18n.exportLabel }}
               </h3>
               <div class="block">
                  <div class="">
                     <div>
                        <label class="inline-flex items-center">
                           <input
                              v-model="formSettings.enablePxConvert"
                              type="checkbox"
                           />
                           <span class="ml-2">{{
                              usedI18n.enablePxUnitConversion
                           }}</span>
                        </label>
                     </div>
                  </div>
               </div>
               <div
                  class="grid grid-cols-1 gap-6 pl-6"
                  v-if="formSettings.enablePxConvert"
               >
                  <label class="block">
                     <span class="text-gray-700">{{
                        usedI18n.targetFormat
                     }}</span>
                     <select
                        v-model="formSettings.pxConvertConfigs.pxConvertFormat"
                        class="mt-1 block w-full"
                     >
                        <option>rem</option>
                        <option>vw</option>
                     </select>
                  </label>
                  <label
                     v-if="
                        formSettings.pxConvertConfigs.pxConvertFormat === 'vw'
                     "
                     class="block"
                  >
                     <span class="text-gray-700">{{
                        usedI18n.designDraftViewportWidth
                     }}</span>
                     <input
                        v-model="formSettings.pxConvertConfigs.viewportWidth"
                        type="number"
                        class="mt-1 block w-full"
                        :placeholder="
                           baseConvertSettings.pxConvertConfigs.viewportWidth +
                           ''
                        "
                     />
                  </label>
                  <label
                     v-if="
                        formSettings.pxConvertConfigs.pxConvertFormat === 'rem'
                     "
                     class="block"
                  >
                     <span class="text-gray-700">{{
                        usedI18n.basicFontSize
                     }}</span>
                     <input
                        v-model="formSettings.pxConvertConfigs.baseFontSize"
                        type="number"
                        class="mt-1 block w-full"
                        :placeholder="
                           baseConvertSettings.pxConvertConfigs.baseFontSize +
                           ''
                        "
                     />
                  </label>
               </div>
               <div class="block">
                  <div class="">
                     <div>
                        <label class="inline-flex items-center">
                           <input
                              v-model="formSettings.enableTailwindcss"
                              type="checkbox"
                           />
                           <span class="ml-2">{{
                              usedI18n.tailwindcssLabel
                           }}</span>
                        </label>
                     </div>
                  </div>
               </div>
               <h3 class="text-gray-700 text-sm mt-4 -mb-1">
                  {{ usedI18n.addFontTitle }}
               </h3>
               <div class="block">
                  <div class="">
                     <div>
                        <label class="block">
                           <span class="text-gray-700">{{
                              usedI18n.resourceAddress
                           }}</span>
                        </label>
                        <div
                           class="flex items-center gap-2 mt-1"
                           v-for="(
                              fontUrl, index
                           ) in formSettings.fontAssetUrlPlaceholders"
                        >
                           <input
                              v-model="
                                 formSettings.fontAssetUrlPlaceholders[index]
                              "
                              type="text"
                              class="flex-auto block w-full"
                              placeholder="https://fonts.googleapis.com/css2?family=Roboto:wght@100&display=swap"
                           />
                           <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.5"
                              stroke="currentColor"
                              class="w-4 h-4 cursor-pointer"
                              @click="
                                 formSettings.fontAssetUrlPlaceholders.splice(
                                    index,
                                    1,
                                 )
                              "
                           >
                              <path
                                 stroke-linecap="round"
                                 stroke-linejoin="round"
                                 d="M19.5 12h-15"
                              />
                           </svg>
                        </div>
                     </div>
                  </div>
                  <button
                     @click="formSettings.fontAssetUrlPlaceholders.push('')"
                     type="button"
                     class="block mt-4 w-full items-center text-sm font-medium text-gray-300 bg-black hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white"
                  >
                     <span class="inline-flex items-center px-4 py-2">
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           fill="none"
                           viewBox="0 0 24 24"
                           stroke-width="1.5"
                           stroke="currentColor"
                           class="w-4 h-4 mr-2 fill-current"
                        >
                           <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M12 4.5v15m7.5-7.5h-15"
                           />
                        </svg>
                        {{ usedI18n.continueAdding }}
                     </span>
                  </button>
               </div>
               <!-- <div class="block">
                  <button
                     @click="showFontSettings = !showFontSettings"
                     type="button"
                     class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-300 bg-black hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white"
                  >
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        class="w-4 h-4 mr-2 fill-current"
                     >
                        <path
                           d="M2.879 7.121A3 3 0 007.5 6.66a2.997 2.997 0 002.5 1.34 2.997 2.997 0 002.5-1.34 3 3 0 104.622-3.78l-.293-.293A2 2 0 0015.415 2H4.585a2 2 0 00-1.414.586l-.292.292a3 3 0 000 4.243zM3 9.032a4.507 4.507 0 004.5-.29A4.48 4.48 0 0010 9.5a4.48 4.48 0 002.5-.758 4.507 4.507 0 004.5.29V16.5h.25a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75v-3.5a.75.75 0 00-.75-.75h-2.5a.75.75 0 00-.75.75v3.5a.75.75 0 01-.75.75h-4.5a.75.75 0 010-1.5H3V9.032z"
                        />
                     </svg>

                     {{ usedI18n.addFont }}
                  </button>
               </div> -->
               <h3 class="text-gray-700 text-sm mt-4 -mb-1">
                  {{ usedI18n.uiSettingsLabel }}
               </h3>
               <label class="block">
                  <span class="text-gray-700">{{
                     usedI18n.codeFontSizeLabel
                  }}</span>
                  <input
                     v-model="formSettings.codeFontSize"
                     type="number"
                     class="mt-1 block w-full"
                     :placeholder="baseUISettings.codeFontSize + ''"
                  />
               </label>
               <label class="block">
                  <span class="text-gray-700">{{
                     usedI18n.viewportSizeLabel
                  }}</span>
                  <div class="flex mt-1 gap-1">
                     <input
                        v-model="formSettings.viewportSize.width"
                        type="number"
                        class="block w-full"
                        :placeholder="baseUISettings.viewportSize.width + ''"
                     />
                     <input
                        v-model="formSettings.viewportSize.height"
                        type="number"
                        class="block w-full"
                        :placeholder="baseUISettings.viewportSize.height + ''"
                     />
                  </div>
               </label>

               <h3 class="text-gray-700 text-sm mt-4 -mb-1">
                  {{ usedI18n.sysSettingsLabel }}
               </h3>
               <label class="block">
                  <span class="text-gray-700">{{
                     usedI18n.languageLabel
                  }}</span>
                  <select
                     v-model="formSettings.language"
                     class="mt-1 block w-full"
                  >
                     <option value="zh-CN">中文</option>
                     <option value="en-US">English</option>
                  </select>
               </label>
            </div>
         </div>
         <div
            v-else-if="notSupport"
            class="flex justify-center items-center h-full italic"
         >
            {{ usedI18n.theCurrentNodeDoesNotSupportRendering }}
         </div>
         <iframe
            v-else-if="formSettings.isPreview"
            :srcdoc="rendererSrcDoc"
            class="w-full h-full"
         ></iframe>
         <div v-else class="h-full w-full relative">
            <div
               class="inline-flex z-10 shadow-sm absolute bottom-3 right-2"
               role="group-actions"
            >
               <button
                  id="copyBtn"
                  type="button"
                  class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-300 bg-black hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white"
               >
                  <svg
                     aria-hidden="true"
                     class="w-3.5 h-3.5 mr-2 fill-current"
                     fill="currentColor"
                     xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 384 512"
                  >
                     <path
                        d="M192 0c-41.8 0-77.4 26.7-90.5 64H64C28.7 64 0 92.7 0 128V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64H282.5C269.4 26.7 233.8 0 192 0zm0 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM112 192H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16z"
                     />
                  </svg>
                  {{ highCopyBtnText ?? usedI18n.copyBtnText }}
               </button>
               <button
                  @click="handleExportBtnClick"
                  type="button"
                  class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-300 bg-black hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white"
               >
                  <svg
                     aria-hidden="true"
                     class="w-4 h-4 mr-2 fill-current"
                     fill="currentColor"
                     viewBox="0 0 20 20"
                     xmlns="http://www.w3.org/2000/svg"
                  >
                     <path
                        fill-rule="evenodd"
                        d="M2 9.5A3.5 3.5 0 005.5 13H9v2.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 15.586V13h2.5a4.5 4.5 0 10-.616-8.958 4.002 4.002 0 10-7.753 1.977A3.5 3.5 0 002 9.5zm9 3.5H9V8a1 1 0 012 0v5z"
                        clip-rule="evenodd"
                     ></path>
                  </svg>
                  {{ usedI18n.exportBtnText }}
               </button>
            </div>
            <pre
               class="language-html overflow-auto h-full w-full"
            ><code class="language-html" v-html="codeblockCode"></code></pre>
         </div>
      </div>
      <!-- <div
         role="modal"
         v-if="showFontSettings"
         class="absolute w-full h-full bg-white p-5 z-30"
      >
         <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6 absolute top-5 right-5 cursor-pointer"
            @click="showFontSettings = false"
         >
            <path
               stroke-linecap="round"
               stroke-linejoin="round"
               d="M6 18L18 6M6 6l12 12"
            />
         </svg>
         <h3 class="text-gray-700 text-sm mt-1">
         </h3>
      </div> -->
   </div>
</template>

<style>
pre[class*='language-'] {
   margin: 0;
}
code[class*='language-'] {
   font-size: var(--code-font-size);
}
</style>
