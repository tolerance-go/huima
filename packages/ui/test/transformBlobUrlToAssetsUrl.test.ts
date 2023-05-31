import { describe, expect, test } from 'vitest'
import { transformBlobUrlToAssetsUrl } from '../src/utils/transformBlobUrlToAssetsUrl'

describe('transformBlobUrlToAssetsUrl', () => {
   test('特殊 blob URL 转换', () => {
      const htmlWithBlobUrl = `<div
      style="width: 383.2765197753906px;
height: 129.683837890625px;
border-radius: 10px;
background-image: url(blob:null/6cf2f86c-4f56-4d6c-b8dc-aff75b20c01d);
background-size: cover;
background-repeat: no-repeat;
background-position: center;
position: absolute;
left: 3.36181640625px;
top: 109.169921875px;"
    ></div>`
      expect(transformBlobUrlToAssetsUrl(htmlWithBlobUrl, 'assets/image.jpg'))
         .toMatchInlineSnapshot(`
        "<div
              style=\\"width: 383.2765197753906px;
        height: 129.683837890625px;
        border-radius: 10px;
        background-image: url(assets/image.jpg);
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        position: absolute;
        left: 3.36181640625px;
        top: 109.169921875px;\\"
            ></div>"
      `)
   })

   test('单个 blob URL 转换', () => {
      const htmlWithBlobUrl = `<div style="background-image: url(blob:xxxxx)"></div>`
      const path = 'assets/image.jpg'
      const expectedHtml = `<div style="background-image: url(${path})"></div>`
      const transformedHtml = transformBlobUrlToAssetsUrl(htmlWithBlobUrl, path)
      expect(transformedHtml).toBe(expectedHtml)
   })

   test('多个 blob URL 转换', () => {
      const htmlWithMultipleBlobUrls = `
      <div style="background-image: url(blob:xxxxx)"></div>
      <div style="background-image: url(blob:yyyyy)"></div>
    `
      const path = 'assets/image.jpg'
      const expectedHtml = `
      <div style="background-image: url(${path})"></div>
      <div style="background-image: url(${path})"></div>
    `
      const transformedHtml = transformBlobUrlToAssetsUrl(
         htmlWithMultipleBlobUrls,
         path,
      )
      expect(transformedHtml).toBe(expectedHtml)
   })

   test('无 blob URL', () => {
      const htmlWithoutBlobUrl = `<div style="background-color: red;"></div>`
      const path = 'assets/image.jpg'
      const transformedHtml = transformBlobUrlToAssetsUrl(
         htmlWithoutBlobUrl,
         path,
      )
      expect(transformedHtml).toBe(htmlWithoutBlobUrl)
   })
})
