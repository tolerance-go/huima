import { DEFAULT_UI_HEADER_HEIGHT } from '@huima/utils'
import { VIEWPORT_HEIGHT, VIEWPORT_WIDTH } from '../constants'
import {
   copiedNodeHtml,
   currentMode,
   nodeMaps,
   settings,
   showMode,
} from '../states'
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

export const handleSettingsBtnClick = () => {
   currentMode.value = showMode.value
   showMode.value = 'settings'
}

export const handleBackFromSettingsBtnClick = () => {
   showMode.value = currentMode.value
}

interface UrlParts {
   name: string
   id: string
   suffix: string
   path: string
}

function extractAndSplitUrls(input: string): UrlParts[] {
   const urlRegex = /url\(['"]?(.*?)['"]?\)/g
   const urls: UrlParts[] = []
   let match

   while ((match = urlRegex.exec(input)) !== null) {
      const url = match[1]
      const lastIndex = url.lastIndexOf('_')
      const dotIndex = url.lastIndexOf('.')
      const lastSlashIndex = url.lastIndexOf('/')
      const path = url.slice(0, lastSlashIndex)
      const name = url.slice(lastSlashIndex + 1, lastIndex)
      const id = url.slice(lastIndex + 1, dotIndex)
      const suffix = url.slice(dotIndex + 1)
      urls.push({ path, name, id, suffix })
   }

   return urls
}

// 处理导出按钮点击事件
export const handleExportBtnClick = () => {
   console.log('handleExportBtnClick', nodeMaps.value)

   const assets = extractAndSplitUrls(copiedNodeHtml.value)

   exportZip(
      [
         {
            path: 'page/index.html',
            content: copiedNodeHtml.value,
         },
         ...assets.map((item) => {
            // figma 的 node 的 id 是用 : 分隔的，所以这里要替换一下，是一个约定
            const figmaNodeId = item.id.replace('-', ':')
            return {
               path: `page/${item.path}/${item.name}_${item.id}.${item.suffix}`,
               content:
                  nodeMaps.value[figmaNodeId].styleMeta?.backgroundImageMeta
                     ?.backgroundImageBytes ?? '',
            }
         }),
      ],
      'page',
   )
}

export const handleViewportSizeChange = () => {
   parent.postMessage(
      {
         pluginMessage: {
            type: 'resize',
            payload: {
               width: settings.uiViewportSize.width ?? VIEWPORT_WIDTH,
               height:
                  (settings.uiViewportSize.height ?? VIEWPORT_HEIGHT) +
                  DEFAULT_UI_HEADER_HEIGHT,
            },
         },
      },
      '*',
   )
}
