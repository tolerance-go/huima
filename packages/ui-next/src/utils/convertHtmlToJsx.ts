// 定义类型
type AttrsType = string[]
type StyleType = { [key: string]: string }

// 属性列表
const attrs: AttrsType = [
   'accept',
   'acceptCharset',
   'accessKey',
   'action',
   'allowFullScreen',
   'allowTransparency',
   'alt',
   'async',
   'autoComplete',
   'autoFocus',
   'autoPlay',
   'capture',
   'cellPadding',
   'cellSpacing',
   'charSet',
   'challenge',
   'checked',
   'classID',
   'className',
   'cols',
   'colSpan',
   'content',
   'contentEditable',
   'contextMenu',
   'controls',
   'coords',
   'crossOrigin',
   'data',
   'dateTime',
   'defer',
   'dir',
   'disabled',
   'download',
   'draggable',
   'encType',
   'form',
   'formAction',
   'formEncType',
   'formMethod',
   'formNoValidate',
   'formTarget',
   'frameBorder',
   'headers',
   'height',
   'hidden',
   'high',
   'href',
   'hrefLang',
   'htmlFor',
   'httpEquiv',
   'icon',
   'id',
   'inputMode',
   'keyParams',
   'keyType',
   'label',
   'lang',
   'list',
   'loop',
   'low',
   'manifest',
   'marginHeight',
   'marginWidth',
   'max',
   'maxLength',
   'media',
   'mediaGroup',
   'method',
   'min',
   'minLength',
   'multiple',
   'muted',
   'name',
   'noValidate',
   'open',
   'optimum',
   'pattern',
   'placeholder',
   'poster',
   'preload',
   'radioGroup',
   'readOnly',
   'rel',
   'required',
   'role',
   'rows',
   'rowSpan',
   'sandbox',
   'scope',
   'scoped',
   'scrolling',
   'seamless',
   'selected',
   'shape',
   'size',
   'sizes',
   'span',
   'spellCheck',
   'src',
   'srcDoc',
   'srcSet',
   'start',
   'step',
   'style',
   'summary',
   'tabIndex',
   'target',
   'title',
   'type',
   'useMap',
   'value',
   'width',
   'wmode',
   'wrap',
]

// 定义样式解析类
class StyleParser {
   styles: StyleType = {}

   constructor(rawStyle: string) {
      this.parse(rawStyle)
   }

   // 解析样式字符串
   parse(rawStyle: string): void {
      this.styles = {}
      rawStyle.split(';').forEach((style) => {
         style = style.trim()
         const firstColon = style.indexOf(':')
         const key = style.substr(0, firstColon)
         const value = style.substr(firstColon + 1).trim()
         if (key !== '') {
            this.styles[key] = value
         }
      })
   }

   // 转化为 JSX 字符串
   toJSXString(): string {
      let output: string[] = []
      for (let key in this.styles) {
         if (!this.styles.hasOwnProperty(key)) {
            continue
         }
         output.push(
            this.toJSXKey(key) + ': ' + this.toJSXValue(this.styles[key]),
         )
      }
      return output.join(', ')
   }

   // 将 CSS 样式键转为 JSX 样式键
   toJSXKey(key: string): string {
      return this.hyphenToCamelCase(key)
   }

   // 将 CSS 样式值转为 JSX 样式值
   toJSXValue(value: string): string {
      return this.isNumeric(value) ? value : `'${value.replace(/'/g, '"')}'`
   }

   // 转化连字符为驼峰格式
   hyphenToCamelCase(string: string): string {
      return string.replace(/-(.)/g, (match, chr) => chr.toUpperCase())
   }

   // 判断是否为数值
   isNumeric(input: string | number | undefined | null): boolean {
      return (
         input !== undefined &&
         input !== null &&
         (typeof input === 'number' || parseInt(input, 10).toString() === input)
      )
   }
}

// HTML 转化函数
export function convertHtmlToJsx(html: string): string {
   // 在这里，我们简单地使用了一个临时解决方案。实际上，如果你有大量的 HTML，你可能希望使用一个成熟的 HTML 解析器库来处理这些情况。

   html = html
      .replace(/\sclass=/g, ' className=')
      .replace(/\sfor=/g, ' htmlFor=')
      // 替换注释
      .replace(/<!--/g, '{/*')
      .replace(/-->/g, '*/}')
   ;[
      'area',
      'base',
      'br',
      'col',
      'command',
      'embed',
      'hr',
      'img',
      'input',
      'keygen',
      'link',
      'meta',
      'param',
      'source',
      'track',
      'wbr',
   ].forEach((tag) => {
      const regex = new RegExp('<(' + tag + '[^/]*?)>', 'g')
      html = html.replace(regex, (_, str) => '<' + str + '/>')
   })

   // 替换属性名
   attrs.forEach((attr) => {
      const origin_attr = attr.toLowerCase()
      const regex = new RegExp('\\s' + origin_attr + '=', 'g')
      html = html.replace(regex, ' ' + attr + '=')
   })

   // 替换样式
   html = html.replace(/\sstyle="([^]+?)"/g, (attr, styles) => {
      const jsxStyles = new StyleParser(styles).toJSXString()
      return ' style={{' + jsxStyles + '}}'
   })

   return html
}
