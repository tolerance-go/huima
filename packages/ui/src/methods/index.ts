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
   if (showMode.value !== 'settings') {
      currentMode.value = showMode.value
   }
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

export const convertPxValueToRelative = (value: number) => {
   if (settings.enablePxConvert) {
      if (settings.pxConvertConfigs.pxConvertFormat === 'rem') {
         // 这里的算法是把像素转换为 rem
         // 在大多数浏览器中，1 rem 的默认值是 16 px
         // 所以我们用 px 值除以 baseSize
         let remValue = value / settings.pxConvertConfigs.pxConvertBaseFontSize
         return `${remValue}rem`
      } else if (settings.pxConvertConfigs.pxConvertFormat === 'vw') {
         // 这里的算法是把像素转换为 vw
         // 在假设的视口宽度为1000px中，1vw等于10px
         // 所以我们用 px 值除以 (viewportWidth / 100)
         let vwValue = value / (settings.pxConvertConfigs.viewportWidth / 100)
         return `${vwValue}vw`
      }
   }

   return `${value}px`
}
