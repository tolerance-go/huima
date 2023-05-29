import { describe, expect, test } from 'vitest'
import { transformBlobUrlToAssetsUrl } from '../src/utils/transformBlobUrlToAssetsUrl'

describe('transformBlobUrlToAssetsUrl', () => {
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
