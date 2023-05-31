import { describe, expect, test } from 'vitest'
import { convertFigmaIdToHtmlId } from '../src/utils/convertFigmaIdToHtmlId'

describe('convertFigmaIdToHtmlId', () => {
   test('替换单个 :', () => {
      const figmaId = 'page1:frame1'
      const expectedHtmlId = 'page1-frame1'
      const htmlId = convertFigmaIdToHtmlId(figmaId)
      expect(htmlId).toBe(expectedHtmlId)
   })

   test('替换多个 :', () => {
      const figmaId = 'page1:frame1:group1'
      const expectedHtmlId = 'page1-frame1-group1'
      const htmlId = convertFigmaIdToHtmlId(figmaId)
      expect(htmlId).toBe(expectedHtmlId)
   })

   test('无 :', () => {
      const figmaId = 'page1'
      const expectedHtmlId = 'page1'
      const htmlId = convertFigmaIdToHtmlId(figmaId)
      expect(htmlId).toBe(expectedHtmlId)
   })

   test('空字符串', () => {
      const figmaId = ''
      const expectedHtmlId = ''
      const htmlId = convertFigmaIdToHtmlId(figmaId)
      expect(htmlId).toBe(expectedHtmlId)
   })
})
