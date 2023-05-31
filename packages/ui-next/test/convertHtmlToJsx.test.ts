import { describe, expect, test } from 'vitest'
import { convertHtmlToJsx } from '../src/utils/convertHtmlToJsx'

describe('convertHtmlToJsx', () => {
   // 测试转换带有类名的 HTML
   test('转换带有类名的 HTML', () => {
      const input = '<div class="hello">Hello</div>'
      const output = convertHtmlToJsx(input)
      expect(output).toEqual('<div className="hello">Hello</div>')
   })

   // 测试转换带有样式的 HTML
   test('转换带有样式的 HTML', () => {
      const input = '<div style="color: red;">Hello</div>'
      const output = convertHtmlToJsx(input)
      expect(output).toEqual("<div style={{color: 'red'}}>Hello</div>")
   })

   // 测试转换自闭合标签
   test('转换自闭合标签', () => {
      const input = '<img src="image.jpg">'
      const output = convertHtmlToJsx(input)
      expect(output).toEqual('<img src="image.jpg"/>')
   })

   // 测试转换带有嵌套标签的 HTML
   test('转换带有嵌套标签的 HTML', () => {
      const input = '<div><span style="color: red;">Hello</span></div>'
      const output = convertHtmlToJsx(input)
      expect(output).toEqual(
         "<div><span style={{color: 'red'}}>Hello</span></div>",
      )
   })

   // 测试转换带有多个样式的 HTML
   test('转换带有多个样式的 HTML', () => {
      const input = '<div style="color: red; font-size: 16px;">Hello</div>'
      const output = convertHtmlToJsx(input)
      expect(output).toEqual(
         "<div style={{color: 'red', fontSize: '16px'}}>Hello</div>",
      )
   })

   // 测试处理空输入
   test('处理空输入', () => {
      const input = ''
      const output = convertHtmlToJsx(input)
      expect(output).toEqual('')
   })

   // 测试转换带有多个注释的 HTML
   test('转换带有多个注释的 HTML', () => {
      const input = '<div><!-- Comment 1 --><!-- Comment 2 --></div>'
      const output = convertHtmlToJsx(input)
      expect(output).toEqual('<div>{/* Comment 1 */}{/* Comment 2 */}</div>')
   })

   // 测试 style 带着换行
   test('style 带着换行', () => {
      const input = '<div style="color: red;\nfont-size: 16px;">Hello</div>'
      const output = convertHtmlToJsx(input)
      expect(output).toEqual(
         "<div style={{color: 'red', fontSize: '16px'}}>Hello</div>",
      )
   })
})
