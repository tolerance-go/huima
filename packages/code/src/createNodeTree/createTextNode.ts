import { getRotationStyle } from '../css-converts/getRotationStyle'
import { Attrs, CSSStyle, NodeInfo, NodeTree } from '../type'
import { findSolidPaint } from '../utils/findSolidPaint'
import { getFillSolidColor } from '../utils/getFillSolidColor'

const getLineHeightStyle = (lineHeight?: LineHeight) => {
   if (!lineHeight) {
      return undefined
   }

   let lineHeightStyle
   if (lineHeight.unit === 'PIXELS') {
      lineHeightStyle = String(lineHeight.value) + 'px'
   } else if (lineHeight.unit === 'PERCENT') {
      lineHeightStyle = String(lineHeight.value / 100)
   } else if (lineHeight.unit === 'AUTO') {
      lineHeightStyle = 'normal'
   }

   return lineHeightStyle
}

const getLetterSpacingStyleValue = (
   letterSpacing?: LetterSpacing,
   fontSize?: number,
) => {
   if (!letterSpacing) {
      return undefined
   }

   if (letterSpacing.unit === 'PIXELS') {
      return String(letterSpacing.value) + 'px'
   } else if (letterSpacing.unit === 'PERCENT') {
      if (!fontSize) return undefined

      // 在 CSS 中，字母间距的百分比是相对于字体大小的，所以我们需要将其转换为像素
      return String((letterSpacing.value / 100) * Number(fontSize)) + 'px'
   }
   return undefined
}

export const createTextNode = async (
   node: TextNode,
   baseStyle: CSSStyle,
   nodeInfo: NodeInfo,
   getChildren: () => Promise<NodeTree[]>,
): Promise<NodeTree> => {
   let children = []

   let segments = node.getStyledTextSegments([
      'fontSize',
      'fontName',
      'fontWeight',
      'textDecoration',
      'textCase',
      'lineHeight',
      'letterSpacing',
      'fills',
      // 'textStyleId',
      // 'fillStyleId',
      'listOptions',
      'indentation',
      'hyperlink',
   ])
   for (let segment of segments) {
      let fontWeight = segment.fontWeight
      let fontFamily = segment.fontName?.family // 需要确保 fontName 不是 undefined
      let fontSize = segment.fontSize
      const {
         lineHeight,
         letterSpacing,
         textDecoration,
         textCase,
         listOptions,
         indentation,
         hyperlink,
         characters,
      } = segment

      const solidFill = findSolidPaint(segment.fills)

      let textDecorationCSS
      switch (textDecoration) {
         case 'NONE':
            textDecorationCSS = 'none'
            break
         case 'UNDERLINE':
            textDecorationCSS = 'underline'
            break
         case 'STRIKETHROUGH':
            textDecorationCSS = 'line-through'
            break
      }

      let textCaseCSS
      switch (textCase) {
         case 'ORIGINAL':
            textCaseCSS = 'none'
            break
         case 'UPPER':
            textCaseCSS = 'uppercase'
            break
         case 'LOWER':
            textCaseCSS = 'lowercase'
            break
         case 'TITLE':
            textCaseCSS = 'capitalize'
            break
      }

      let indentationCSS = indentation ? `${indentation}px` : undefined

      let attrs: Attrs = {}
      if (hyperlink) {
         if (hyperlink.type === 'URL') {
            attrs.href = hyperlink.value
         } else if (hyperlink.type === 'NODE') {
            // 需要特殊处理 NODE 类型的超链接
            // 这可以让设计者在同一份 Figma 文档中建立导航，比如设计一个 APP 的多个页面
            attrs.href = hyperlink.value
         }
      }

      let tag = hyperlink ? 'a' : 'span'

      let style: CSSStyle = {
         'font-weight': fontWeight.toString(),
         'font-family': fontFamily,
         'font-size': fontSize.toString() + 'px',
         color: solidFill ? getFillSolidColor(solidFill) : undefined,
         'line-height': getLineHeightStyle(lineHeight),
         'letter-spacing': getLetterSpacingStyleValue(letterSpacing, fontSize),
         'text-decoration': textDecorationCSS,
         'text-transform': textCaseCSS,
         // 'list-style-type': listStyleTypeCSS,
         // 'list-style-position': listStylePositionCSS,
         'text-indent': indentationCSS,
      }

      let subChildren: NodeTree[] = []

      if (listOptions && listOptions.type !== 'NONE') {
         tag = listOptions.type === 'UNORDERED' ? 'ul' : 'ol'
         style = {
            margin: 0,
            'padding-right': 0,
            ...style,
         }

         subChildren = characters
            .split('\n')
            .filter(Boolean)
            .map(
               (item) =>
                  ({
                     nodeInfo,
                     tag: 'li',
                     attrs: {},
                     style: {}, // 也可以设置为单独的样式
                     children: [],
                     textContent: item,
                  } as NodeTree),
            )
      }

      children.push({
         tag,
         attrs,
         style,
         textContent: subChildren.length
            ? undefined
            : characters?.replace('\n', '<br/>'),
         nodeInfo,
         children: subChildren,
      })
   }

   let tag = 'span'

   const solidFill = findSolidPaint(node.fills)

   let style = {
      ...baseStyle,
      ...getRotationStyle(node),
      'letter-spacing':
         typeof node.letterSpacing === 'object' &&
         typeof node.fontSize === 'number'
            ? getLetterSpacingStyleValue(node.letterSpacing, node.fontSize)
            : undefined,
      'font-size':
         typeof node.fontSize === 'string' ? node.fontSize + 'px' : undefined,
      'font-weight':
         typeof node.fontWeight === 'string' ? node.fontWeight : undefined,
      'line-height':
         // 注意：如果文本的垂直对齐方式是居中，则行高应该等于文本框的高度
         node.textAlignVertical === 'CENTER'
            ? node.height + 'px'
            : typeof node.lineHeight === 'object'
            ? getLineHeightStyle(node.lineHeight)
            : undefined,
      'text-align': node.textAlignHorizontal.toLowerCase(),
      'vertical-align':
         node.textAlignVertical === 'CENTER'
            ? 'middle'
            : node.textAlignVertical.toLowerCase(),
      color: solidFill ? getFillSolidColor(solidFill) : undefined,
      display: 'inline-block',
      'text-overflow': node.textAutoResize === 'TRUNCATE' ? 'ellipsis' : 'clip',
      'white-space': node.textAutoResize === 'TRUNCATE' ? 'nowrap' : 'normal',
      overflow: node.textAutoResize === 'TRUNCATE' ? 'hidden' : 'visible',
   }

   return {
      nodeInfo,
      tag,
      style,
      children,
   }
}
