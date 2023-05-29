import { describe, expect, test } from 'vitest'
import {
   UrlParts,
   extractAndSplitBgImgUrls,
} from '../src/utils/extractAndSplitBgImgUrls'

describe('extractAndSplitUrls', () => {
   test('基本用例', () => {
      const input = `background-image: url('assets/images/image_01-02.jpg')`
      const expectedUrls = [
         {
            path: 'assets/images',
            name: 'image',
            id: '01-02',
            suffix: 'jpg',
         },
      ]
      const urls = extractAndSplitBgImgUrls(input)
      expect(urls).toEqual(expectedUrls)
   })

   test('空格', () => {
      const input = `background-image  :  url('assets/images/image_01-02.jpg')`
      const expectedUrls = [
         {
            path: 'assets/images',
            name: 'image',
            id: '01-02',
            suffix: 'jpg',
         },
      ]
      const urls = extractAndSplitBgImgUrls(input)
      expect(urls).toEqual(expectedUrls)
   })
   test('空格2', () => {
      const input = `background-image:url('assets/images/image_01-02.jpg')`
      const expectedUrls = [
         {
            path: 'assets/images',
            name: 'image',
            id: '01-02',
            suffix: 'jpg',
         },
      ]
      const urls = extractAndSplitBgImgUrls(input)
      expect(urls).toEqual(expectedUrls)
   })

   test('多个_', () => {
      const input = `background-image: url('assets/images/image_image_01-02.jpg')`
      const expectedUrls = [
         {
            path: 'assets/images',
            name: 'image_image',
            id: '01-02',
            suffix: 'jpg',
         },
      ]
      const urls = extractAndSplitBgImgUrls(input)
      expect(urls).toEqual(expectedUrls)
   })

   test('多个 URL', () => {
      const input = `
          background-image: url('assets/images/image_01.jpg'),
          background-image: url('assets/icons/icon_02.svg')
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
      const urls = extractAndSplitBgImgUrls(input)
      expect(urls).toEqual(expectedUrls)
   })

   test('无 URL', () => {
      const input = `background-color: red;`
      const expectedUrls: UrlParts[] = []
      const urls = extractAndSplitBgImgUrls(input)
      expect(urls).toEqual(expectedUrls)
   })
})
