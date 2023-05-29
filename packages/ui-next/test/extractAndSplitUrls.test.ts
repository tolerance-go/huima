import { describe, expect, test } from 'vitest'
import { UrlParts, extractAndSplitUrls } from '../src/utils/extractAndSplitUrls'

describe('extractAndSplitUrls', () => {
   test('基本用例', () => {
      const input = `url('assets/images/image_01-02.jpg')`
      const expectedUrls = [
         {
            path: 'assets/images',
            name: 'image',
            id: '01-02',
            suffix: 'jpg',
         },
      ]
      const urls = extractAndSplitUrls(input)
      expect(urls).toEqual(expectedUrls)
   })

   test('多个_', () => {
      const input = `url('assets/images/image_image_01-02.jpg')`
      const expectedUrls = [
         {
            path: 'assets/images',
            name: 'image_image',
            id: '01-02',
            suffix: 'jpg',
         },
      ]
      const urls = extractAndSplitUrls(input)
      expect(urls).toEqual(expectedUrls)
   })

   test('多个 URL', () => {
      const input = `
          url('assets/images/image_01.jpg'),
          url('assets/icons/icon_02.svg')
       `
      const expectedUrls = [
         {
            path: 'assets/images',
            name: 'image',
            id: '01',
            suffix: 'jpg',
         },
         {
            path: 'assets/icons',
            name: 'icon',
            id: '02',
            suffix: 'svg',
         },
      ]
      const urls = extractAndSplitUrls(input)
      expect(urls).toEqual(expectedUrls)
   })

   test('无 URL', () => {
      const input = `background-color: red;`
      const expectedUrls: UrlParts[] = []
      const urls = extractAndSplitUrls(input)
      expect(urls).toEqual(expectedUrls)
   })
})
