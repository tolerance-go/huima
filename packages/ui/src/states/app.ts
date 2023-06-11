import {
   DEFAULT_BASE_FONT_SIZE,
   DEFAULT_VIEWPORT_HEIGHT,
   DEFAULT_VIEWPORT_WIDTH,
} from '@huima/common/dist/constants'
import {
   BaseConvertSettings,
   BaseRenderSettings,
   BaseUISettings,
   BaseUploadSettings,
   ImageFillMeta,
   Settings,
   StaticNode,
} from '@huima/common/dist/types'
import { renderStaticNode } from '@huima/render-static-node'
import parserBabel from 'prettier/parser-babel'
import parserHtml from 'prettier/parser-html'
import prettier from 'prettier/standalone'
import Prism from 'prismjs'
import { computed, reactive, ref } from 'vue'
import { normalizeCss } from '../constants/normalize.css'
import { isJsDesign } from '../env'
import { convertFigmaIdToHtmlId } from '../utils/convertFigmaIdToHtmlId'
import { convertHtmlToJsx } from '../utils/convertHtmlToJsx'
import { getScriptStr } from '../utils/getScriptStr'

export const i18n = reactive({
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
      uploadLabel: '上传',
      uiSettingsLabel: '界面',
      sysSettingsLabel: '系统',
      viewportHeightLabel: '视口高度',
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
      tokenLabel: '令牌',
      viewportWidthLabel: '视口宽高',
      languageLabel: '语言',
      targetRuntimeEnvLabel: '运行环境',
      targetRuntimeDslLabel: 'DSL',
      uploadBtnText: '上传',
   },
   'en-US': {
      tokenLabel: 'Token',
      uploadLabel: 'Upload',
      languageLabel: 'Language',
      codeFontSizeLabel: 'Code font-size',
      targetRuntimeEnvLabel: 'Runtime Env',
      targetRuntimeDslLabel: 'DSL',
      tailwindcssLabel: 'Enable Tailwindcss',
      sysSettingsLabel: 'System',
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
      viewportHeightLabel: 'Viewport height',
      viewportWidthLabel: 'Viewport width',
      basicsLabel: 'Basics',
      configureLabel: 'Settings',
      copyBtnText: 'Copy',
      uploadBtnText: 'Upload',
      copySuccessBtnText: 'Copy successful!',
      preview: 'Preview',
      theCurrentNodeDoesNotSupportRendering:
         'Rendering not supported on current node.',
   },
})

// 高优先级的复制按钮文案
export const highCopyBtnText = ref()

export const usedI18n = computed(() => {
   // if (isJsDesign) {
   //    return i18n['zh-CN']
   // }
   // return i18n['en-US']
   return i18n[settings.value.language]
})

export const isSettingsPage = ref(false)

export const selectedNode = ref<StaticNode | null>(null)

export const notSupport = ref(false)

export const baseRenderSettings: BaseRenderSettings = {
   fontAssetUrlPlaceholders: [''],
   isPreview: false,
}

export const baseUISettings: BaseUISettings = {
   language: isJsDesign ? 'zh-CN' : 'en-US',
   codeFontSize: 16,
   viewportSize: {
      width: DEFAULT_VIEWPORT_WIDTH,
      height: DEFAULT_VIEWPORT_HEIGHT,
   },
}

export const baseUploadSettings: BaseUploadSettings = {}

export const baseConvertSettings: BaseConvertSettings = {
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

export const defaultSettings = {
   ...baseRenderSettings,
   ...baseUISettings,
   ...baseConvertSettings,
   ...baseUploadSettings,
}

export const getDefaultSettings = (): Settings => {
   return JSON.parse(JSON.stringify(defaultSettings))
}

export const formSettings = reactive(getDefaultSettings())

export const settings = computed(() => {
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

// 用于渲染 iframe 的 html 代码
export const rendererCode = computed(() => {
   if (!selectedNode.value) return ''

   return renderStaticNode(settings.value, selectedNode.value, {
      convertBackgroundImageCss: (
         imageFillMeta: ImageFillMeta,
         node: StaticNode,
      ) => {
         const url = URL.createObjectURL(
            new Blob([imageFillMeta!.imageBytes], {
               type: `image/${imageFillMeta!.imageExtension}`,
            }),
         )
         return `url(${url})`
      },
   })
})

export const imageFillMetaNodeMaps: Record<string, ImageFillMeta> = {}

export const htmlCode = computed(() => {
   if (!selectedNode.value) return ''

   return renderStaticNode(settings.value, selectedNode.value, {
      convertBackgroundImageCss: (
         imageFillMeta: ImageFillMeta,
         node: StaticNode,
      ) => {
         imageFillMetaNodeMaps[node.id] = imageFillMeta

         return `url(${`'assets/${node.name}_${convertFigmaIdToHtmlId(
            node.id,
         )}.${imageFillMeta.imageExtension}'`})`
      },
   })
})

// 复制到剪贴板的 html 代码
export const copiedCode = computed(() => {
   if (!selectedNode.value) return ''

   const extension =
      settings.value.targetRuntimeDsl === 'jsx' ? 'babel' : 'html'
   // 使用 Prettier 格式化代码
   const formattedCode = prettier.format(
      settings.value.targetRuntimeDsl === 'jsx'
         ? convertHtmlToJsx(htmlCode.value)
         : htmlCode.value,
      {
         parser: extension,
         plugins: [parserHtml, parserBabel],
      },
   )
   return formattedCode
})

// 展示在代码区的 html 代码
export const codeblockCode = computed(() => {
   const extension = settings.value.targetRuntimeDsl === 'jsx' ? 'jsx' : 'html'

   // 使用 Prism 进行高亮
   const highlightedCode = Prism.highlight(
      copiedCode.value,
      Prism.languages[extension],
      extension,
   )

   return highlightedCode
})

export const fontScriptStr = computed(() => {
   return settings.value.fontAssetUrlPlaceholders
      .filter(Boolean)
      .map((url) => {
         return `<link rel="stylesheet" href="${url}">`
      })
      .join('\n')
})

export const rendererSrcDoc = computed(() => {
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
