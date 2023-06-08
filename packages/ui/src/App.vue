<script setup lang="ts">
import {
   DEFAULT_UI_FOOTER_HEIGHT,
   DEFAULT_UI_HEADER_HEIGHT,
   MIN_VIEWPORT_LENGTH,
   postActionToCode,
} from '@huima/common'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import debounce from 'lodash.debounce'
import { watch, watchEffect } from 'vue'
import { normalizeCss } from './constants/normalize.css'
import { createServerNode } from './createServerNode'
import {
   codeblockCode,
   copiedCode,
   fontScriptStr,
   formSettings,
   highCopyBtnText,
   htmlCode,
   imageFillMetaNodeMaps,
   isSettingsPage,
   notSupport,
   rendererSrcDoc,
   selectedNode,
   settings,
   usedI18n,
} from './states/app'
import {
   convertFigmaIdToHtmlId,
   convertHtmlIdToFigmaId,
} from './utils/convertFigmaIdToHtmlId'
import { extractAndSplitBgImgUrls } from './utils/extractAndSplitBgImgUrls'
import request from './utils/request'
import Alert from './views/Alert.vue'
import SettingsComponent from './views/Settings.vue'

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

const handleUploadClick = debounce(async () => {
   if (!settings.value.token) {
      window.alert2('没有发现 token，请在设置页面配置')
      return
   }

   if (!selectedNode.value) {
      return
   }

   try {
      const imgFiles: File[] = []

      const nodeData = createServerNode(settings.value, selectedNode.value, {
         convertImageFillMetaBytesToAssertUrl(imageFillMeta, node) {
            imageFillMetaNodeMaps[node.id] = imageFillMeta

            const blob = new Blob([imageFillMeta.imageBytes], {
               type: 'image/' + imageFillMeta.imageExtension,
            }) // 假设 arrayBuffer 是 JPEG 图片的数据

            const imgName = `${selectedNode.value!.name}_${
               node.name
            }_${convertFigmaIdToHtmlId(node.id)}.${
               imageFillMeta.imageExtension
            }`

            const file = new File([blob], imgName) // 第一个参数是文件数据，第二个参数是文件名

            imgFiles.push(file)

            return `/uploads/${imgName}`
         },
      })

      const formData = new FormData()
      for (let i = 0; i < imgFiles.length; i++) {
         formData.append('images', imgFiles[i]) // 'images' 是服务器端接收文件的字段名
      }

      await Promise.all([
         request.post('/api/projects/images/upload', formData, {
            headers: {
               'Content-Type': 'multipart/form-data',
               Authorization: `Bearer ${settings.value.token}`,
            },
         }),
         request.post(
            '/api/projects/upload',
            {
               token: settings.value.token,
               name: selectedNode.value.name,
               nodeData,
               settings: settings.value,
            },
            {
               headers: {
                  Authorization: `Bearer ${settings.value.token}`,
               },
            },
         ),
      ])
      window.alert2('上传成功')
   } catch {
      // ignore
   }
}, 300)
</script>

<template>
   <div class="h-screen flex flex-col">
      <Alert />
      <div
         :style="{ height: DEFAULT_UI_HEADER_HEIGHT + 'px' }"
         class="flex-none px-2 border-b flex justify-end gap-2 items-center overflow-x-auto"
      >
         <label class="relative inline-flex items-center cursor-pointer">
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
            strokeWidth="1.5"
            stroke="currentColor"
            class="w-6 h-6 rotate-90 text-gray-300"
         >
            <path
               stroke-linecap="round"
               stroke-linejoin="round"
               d="M19.5 12h-15"
            />
         </svg>

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
            <SettingsComponent />
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
            <pre
               class="language-html overflow-auto h-full w-full"
            ><code class="language-html" v-html="codeblockCode"></code></pre>
         </div>
      </div>
      <div
         :style="{
            height: DEFAULT_UI_FOOTER_HEIGHT + 'px',
         }"
         class="flex-none px-2 border-t flex justify-between items-center overflow-x-auto"
      >
         <div
            class="flex w-full items-center justify-end"
            v-if="settings.isPreview"
         >
            <button
               @click="handleUploadClick"
               type="button"
               class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-300 bg-black hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white"
            >
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="w-4 h-4 mr-2 fill-current"
               >
                  <path
                     fill-rule="evenodd"
                     d="M10.5 3.75a6 6 0 00-5.98 6.496A5.25 5.25 0 006.75 20.25H18a4.5 4.5 0 002.206-8.423 3.75 3.75 0 00-4.133-4.303A6.001 6.001 0 0010.5 3.75zm2.03 5.47a.75.75 0 00-1.06 0l-3 3a.75.75 0 101.06 1.06l1.72-1.72v4.94a.75.75 0 001.5 0v-4.94l1.72 1.72a.75.75 0 101.06-1.06l-3-3z"
                     clip-rule="evenodd"
                  />
               </svg>

               {{ usedI18n.uploadBtnText }}
            </button>
         </div>
         <div
            class="flex w-full items-center justify-end"
            v-if="!settings.isPreview"
         >
            <div class="inline-flex z-10" role="group-actions">
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
                     xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 24 24"
                     fill="currentColor"
                     class="w-4 h-4 mr-2 fill-current"
                  >
                     <path
                        fill-rule="evenodd"
                        d="M10.5 3.75a6 6 0 00-5.98 6.496A5.25 5.25 0 006.75 20.25H18a4.5 4.5 0 002.206-8.423 3.75 3.75 0 00-4.133-4.303A6.001 6.001 0 0010.5 3.75zm2.25 6a.75.75 0 00-1.5 0v4.94l-1.72-1.72a.75.75 0 00-1.06 1.06l3 3a.75.75 0 001.06 0l3-3a.75.75 0 10-1.06-1.06l-1.72 1.72V9.75z"
                        clip-rule="evenodd"
                     />
                  </svg>

                  {{ usedI18n.exportBtnText }}
               </button>
            </div>
         </div>
      </div>
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
