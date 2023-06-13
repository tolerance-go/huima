import { User as HuimaUser } from '@huima-admin/db'
import { encryptPassword } from '@huima-admin/encrypt-password'
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

export * from './i18n'

// 高优先级的复制按钮文案
export const highCopyBtnText = ref()

export const isSettingsPage = ref(false)

export const selectedNode = ref<StaticNode | null>(null)

export const notSupport = ref(false)

export const userInfo = ref<HuimaUser>()

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
      token:
         formSettings.token &&
         encryptPassword(
            formSettings.token,
            process.env.PLUGIN_PASSWORD_SYMMETRIC_KEY!,
         ),
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
