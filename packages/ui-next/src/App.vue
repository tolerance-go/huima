<script setup lang="ts">
import { StaticNode, UIAction } from '@huima/types-next'
import parsers from 'prettier/parser-html'
import prettier from 'prettier/standalone'
import Prism from 'prismjs'
import { computed, reactive, ref, watchEffect } from 'vue'
import { normalizeCss } from './constants/normalize.css'
import { renderStaticNode } from './renderStaticNode'
import { DSLType, RuntimeEnv } from './types'

const selectedNode = ref<StaticNode | null>(null)

const notSupport = ref(false)

const isDev = ref(false)

const baseFormSettings: {
   enableTailwindcss: boolean
   codeFontSize: number
   targetRuntimeEnv: RuntimeEnv
   targetRuntimeDsl: DSLType
} = {
   enableTailwindcss: false,
   codeFontSize: 16,
   targetRuntimeEnv: 'web',
   targetRuntimeDsl: 'html',
}

const formSettings = reactive({
   ...baseFormSettings,
})

watchEffect(() => {
   document.documentElement.style.setProperty(
      '--code-font-size',
      formSettings.codeFontSize + 'px',
   )
})

const isSettingsPage = ref(false)

// 用于渲染 iframe 的 html 代码
const rendererCode = computed(() => {
   if (!selectedNode.value) return ''

   return renderStaticNode(
      formSettings.targetRuntimeEnv,
      formSettings.targetRuntimeDsl,
      selectedNode.value,
   )
})

// 复制到剪贴板的 html 代码
const copiedCode = computed(() => {
   const extension = 'html'
   // 使用 Prettier 格式化代码
   const formattedCode = prettier.format(rendererCode.value, {
      parser: extension,
      plugins: [parsers],
   })
   return formattedCode
})

// 展示在代码区的 html 代码
const codeblockCode = computed(() => {
   const extension = 'html'
   // 使用 Prism 进行高亮
   const highlightedCode = Prism.highlight(
      copiedCode.value,
      Prism.languages[extension],
      extension,
   )

   return highlightedCode
})

const rendererSrcDoc = computed(() => {
   return `
    <html>
      <head>
        <style>
          ${normalizeCss}
        </style>
      </head>
      <body>
        ${rendererCode.value}
      </body>
    </html>
  `
})

window.onmessage = (event) => {
   if (process.env.WEBPACK_SERVE) {
      return
   }

   if (!event.data.pluginMessage) return

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
         class="flex-none border-b px-4 py-2 flex justify-between items-center"
      >
         <div class="flex space-x-1 flex-auto">
            <select
               class="w-1/4 min-w-max"
               placeholder="选择运行环境"
               v-model="formSettings.targetRuntimeEnv"
            >
               <option value="web">Web</option>
               <option value="miniapp">小程序</option>
            </select>
            <select
               class="w-1/4 min-w-max"
               placeholder="DSL"
               v-model="formSettings.targetRuntimeDsl"
            >
               <option value="html">HTML</option>
               <option value="react">React</option>
               <option value="vue">Vue</option>
            </select>
         </div>
         <label class="flex space-x-2 items-center mr-4">
            <span class="text-gray-700">development</span>
            <input v-model="isDev" type="checkbox" />
         </label>
         <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6 cursor-pointer"
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
            class="w-6 h-6 cursor-pointer"
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
      <div class="flex-auto">
         <div
            v-if="notSupport"
            class="flex justify-center items-center h-full italic"
         >
            当前节点不支持渲染
         </div>
         <iframe
            v-else-if="isDev"
            :srcdoc="rendererSrcDoc"
            class="w-full h-full"
         ></iframe>
         <div class="p-5" v-else-if="isSettingsPage">
            <div role="settings-page" class="grid grid-cols-1 gap-6">
               <div class="block">
                  <div class="mt-2">
                     <div>
                        <label class="inline-flex items-center">
                           <input
                              v-model="formSettings.enableTailwindcss"
                              type="checkbox"
                           />
                           <span class="ml-2">Enable Tailwindcss</span>
                        </label>
                     </div>
                  </div>
               </div>
               <label class="block">
                  <span class="text-gray-700">Code font-size</span>
                  <input
                     v-model="formSettings.codeFontSize"
                     type="number"
                     class="mt-1 block w-full"
                     :placeholder="baseFormSettings.codeFontSize + ''"
                  />
               </label>
            </div>
         </div>
         <pre
            v-else
            class="line-numbers language-html overflow-auto h-full w-full"
         ><code class="language-html"
               v-html="codeblockCode"></code></pre>
      </div>
   </div>
</template>

<style>
pre[class*='language-'] {
   margin: 0;
}
code[class*='language-'],
pre[class*='language-'] {
   font-size: var(--code-font-size);
}
</style>
