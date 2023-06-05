<script setup lang="ts">
import {
   baseConvertSettings,
   baseUISettings,
   formSettings,
   usedI18n,
} from '../states/app'

const handleGetToken = () => {
   window.open('http://localhost:8002/')
}
</script>
<template>
   <h2 class="text-lg">
      {{ usedI18n.configureLabel }}
   </h2>
   <div role="settings-page" class="grid grid-cols-1 gap-6 mt-3">
      <h3 class="text-gray-500 text-sm mt-4">
         {{ usedI18n.uploadLabel }}
      </h3>
      <label class="block">
         <span class="text-gray-700"
            >{{ usedI18n.tokenLabel }}
            <span
               class="text-blue-500 hover:underline cursor-pointer"
               @click="handleGetToken"
               >获取</span
            ></span
         >
         <input
            v-model="formSettings.token"
            type="password"
            class="mt-1 block w-full"
         />
      </label>
      <h3 class="text-gray-500 text-sm mt-4">
         {{ usedI18n.exportLabel }}
      </h3>
      <div class="block">
         <div class="w-full flex gap-1">
            <label class="block flex-1">
               <span class="text-gray-700">{{
                  usedI18n.targetRuntimeEnvLabel
               }}</span>
               <select
                  class="mt-1 w-full"
                  v-model="formSettings.targetRuntimeEnv"
               >
                  <option value="web">Web</option>
                  <!-- <option value="miniapp">{{ usedI18n.miniProgram }}</option> -->
               </select>
            </label>
            <label class="block flex-1">
               <span class="text-gray-700">{{
                  usedI18n.targetRuntimeDslLabel
               }}</span>
               <select
                  class="mt-1 w-full"
                  v-model="formSettings.targetRuntimeDsl"
               >
                  <option value="html">HTML</option>
                  <option value="jsx">JSX</option>
                  <!-- <option value="vue">Vue</option> -->
               </select>
            </label>
         </div>
      </div>
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
            <span class="text-gray-700">{{ usedI18n.targetFormat }}</span>
            <select
               v-model="formSettings.pxConvertConfigs.pxConvertFormat"
               class="mt-1 block w-full"
            >
               <option>rem</option>
               <option>vw</option>
            </select>
         </label>
         <label
            v-if="formSettings.pxConvertConfigs.pxConvertFormat === 'vw'"
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
                  baseConvertSettings.pxConvertConfigs.viewportWidth + ''
               "
            />
         </label>
         <label
            v-if="formSettings.pxConvertConfigs.pxConvertFormat === 'rem'"
            class="block"
         >
            <span class="text-gray-700">{{ usedI18n.basicFontSize }}</span>
            <input
               v-model="formSettings.pxConvertConfigs.baseFontSize"
               type="number"
               class="mt-1 block w-full"
               :placeholder="
                  baseConvertSettings.pxConvertConfigs.baseFontSize + ''
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
                  <span class="ml-2">{{ usedI18n.tailwindcssLabel }}</span>
               </label>
            </div>
         </div>
      </div>
      <h3 class="text-gray-500 text-sm mt-4">
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
                     v-model="formSettings.fontAssetUrlPlaceholders[index]"
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
                        formSettings.fontAssetUrlPlaceholders.splice(index, 1)
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
      <h3 class="text-gray-500 text-sm mt-4">
         {{ usedI18n.uiSettingsLabel }}
      </h3>
      <label class="block">
         <span class="text-gray-700">{{ usedI18n.codeFontSizeLabel }}</span>
         <input
            v-model="formSettings.codeFontSize"
            type="number"
            class="mt-1 block w-full"
            :placeholder="baseUISettings.codeFontSize + ''"
         />
      </label>
      <div class="block">
         <div class="w-full flex gap-1">
            <label class="block flex-1">
               <span class="text-gray-700">{{
                  usedI18n.viewportWidthLabel
               }}</span>
               <input
                  v-model="formSettings.viewportSize.width"
                  type="number"
                  class="mt-1 block w-full"
                  :placeholder="baseUISettings.viewportSize.width + ''"
               />
            </label>
            <label class="block flex-1">
               <span class="text-gray-700">{{
                  usedI18n.viewportHeightLabel
               }}</span>
               <input
                  v-model="formSettings.viewportSize.height"
                  type="number"
                  class="mt-1 block w-full"
                  :placeholder="baseUISettings.viewportSize.height + ''"
               />
            </label>
         </div>
      </div>

      <h3 class="text-gray-500 text-sm mt-4">
         {{ usedI18n.sysSettingsLabel }}
      </h3>
      <label class="block">
         <span class="text-gray-700">{{ usedI18n.languageLabel }}</span>
         <select v-model="formSettings.language" class="mt-1 block w-full">
            <option value="zh-CN">中文</option>
            <option value="en-US">English</option>
         </select>
      </label>
   </div>
</template>
