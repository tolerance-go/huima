import { StaticNode, StaticTextNode } from '@huima/types-next'
import { DSLType, RuntimeEnv } from '../types'

/**
 * 1.
 */
function groupByNewline(
   chars: StaticTextNode['styledCharacters'],
): StaticTextNode['styledCharacters'][] {
   const groups: StaticTextNode['styledCharacters'][] = []
   let currentGroup: StaticTextNode['styledCharacters'] = []

   chars.forEach((charInfo) => {
      if (charInfo.char === '\n') {
         // Start a new group when encountering a newline
         if (currentGroup.length > 0) {
            groups.push(currentGroup)
         }
         currentGroup = []
      } else {
         currentGroup.push(charInfo)
      }
   })

   // Push the last group if it's not empty
   if (currentGroup.length > 0) {
      groups.push(currentGroup)
   }

   return groups
}

// Convert RGB to Hex
function rgbToHex(r: number, g: number, b: number): string {
   r = Math.floor(r * 255)
   g = Math.floor(g * 255)
   b = Math.floor(b * 255)
   return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

/**
 * 要求将 groupByNewline  返回结果进行 html 内容拼接，第一层数组为 p 标签，
 * 第二层每一个元素都为 span 标签包裹，同时把对应属性转换成 css 属性作用到 style 上
 * 
 * 1. 需要支持以下参数 paragraphSpacing：作用到组级 p 标签上，使用 margin-bottom 表示,
      textAutoResize：作用到最外层的 p 标签上，处理 fixed 和 truncate 两种情况，如果是 fixed 需要额外传入 width 和 height 设置到最外层的 p 标签上，fixed 达到的效果是 固定尺寸
      而 truncate 达到的效果是超出部分显示省略号,
      textAlignHorizontal：作用到最外层的 p 标签上，达到横向对齐效果,
      textAlignVertical：作用到最外层的 p 标签上，达到纵向对齐效果
 * 2. options 缩小范围到使用到参数的情况，不需要全部支持
 * 3. figma 中 textAutoResize 的类型 'NONE' | 'WIDTH_AND_HEIGHT' | 'HEIGHT' | 'TRUNCATE'，
 *   fixed 对应的应该是 'NONE'，truncate 对应 'TRUNCATE'
 * 4. p 中不能继续包裹 p 元素，最外层使用 div 包裹，类型为 inline-block
 * 5. figma 中 textAlignHorizontal: 'LEFT' | 'CENTER' | 'RIGHT' | 'JUSTIFIED'
  textAlignVertical: 'TOP' | 'CENTER' | 'BOTTOM'，对应的 css 属性为 text-align 和 vertical-align，需要转换成合法的 css 属性
 * 6. 如果容器是 display：inline-flex 的话，那么 vertical-align 就不起作用了，需要使用 align-items 和 justify-content 来实现
  align-items 需要加上 flex 前缀，同时结构上需要嵌套一层 div，内层的 div 完全包裹内部的文字，文字多大它就多大，自适应内部文字的大小
 */
function convertToHtml(
   groups: StaticTextNode['styledCharacters'][],
   options: Pick<
      StaticTextNode,
      | 'paragraphSpacing'
      | 'textAutoResize'
      | 'textAlignHorizontal'
      | 'textAlignVertical'
      | 'width'
      | 'height'
   >,
): string {
   let html = ''

   const containerStyle =
      `
   display: inline-flex;
   justify-content: ${((val) => {
      if (val === 'LEFT') {
         return 'start'
      }
      if (val === 'CENTER') {
         return 'center'
      }
      if (val === 'RIGHT') {
         return 'end'
      }
      if (val === 'JUSTIFIED') {
         return 'space-between'
      }
      return 'start'
   })(options.textAlignHorizontal)};
   align-items: ${((val) => {
      if (val === 'TOP') {
         return 'start'
      }
      if (val === 'CENTER') {
         return 'center'
      }
      if (val === 'BOTTOM') {
         return 'end'
      }
      return 'start'
   })(options.textAlignVertical)};
   ${
      options.textAutoResize === 'NONE'
         ? `width: ${options.width}px; height: ${options.height}px;`
         : ''
   }
   ${
      options.textAutoResize === 'TRUNCATE'
         ? 'overflow: hidden; text-overflow: ellipsis; white-space: nowrap;'
         : ''
   }
 `.trimEnd() + '\n'

   const innerContainerStyle = `
   display: inline-block;
   `

   html += `<div style="${containerStyle}">`
   html += `<div style="${innerContainerStyle}">`

   /**
    * 1. 需要将 p 和 span 的浏览器默认样式移除
    * 2. fills 有多个类型（SolidPaint | GradientPaint | ImagePaint | VideoPaint）需要判断，目前只处理 SolidPaint
    * 3. fills 的颜色使用 Hex 表示
    * 4. fills 过滤 visible 为 false 的情况
    * 5. lineHeight 的类型为 declare type LineHeight =
  | {
      readonly value: number
      readonly unit: 'PIXELS' | 'PERCENT'
    }
  | {
      readonly unit: 'AUTO'
    } 需要判断处理
    */
   groups.forEach((group, index) => {
      const groupStyle = `
      margin: 0;
      padding: 0;
      margin-bottom: ${
         index < groups.length - 1 ? options.paragraphSpacing + 'px' : '0'
      };
    `

      html += `<p style="${groupStyle}">`

      group.forEach((charInfo) => {
         // Only process SolidPaint
         const solidFills = charInfo.fills.filter(
            (fill) => fill.type === 'SOLID' && fill.visible !== false,
         ) as SolidPaint[]
         const color = solidFills.length > 0 ? solidFills[0].color : null
         const colorHex = color
            ? rgbToHex(color.r, color.g, color.b)
            : 'transparent'

         const lineHeight =
            charInfo.lineHeight.unit === 'AUTO'
               ? 'normal'
               : `${charInfo.lineHeight.value}px`

         const style = `
        font-size: ${charInfo.fontSize}px;
        font-weight: ${charInfo.fontWeight};
        font-family: ${charInfo.fontName.family};
        color: ${colorHex};
        text-transform: ${charInfo.textCase};
        line-height: ${lineHeight};
        letter-spacing: ${charInfo.letterSpacing.value}px;
        text-decoration: ${charInfo.textDecoration};
        margin: 0;
        padding: 0;
      `
         html += `<span style="${style}">${charInfo.char}</span>`
      })

      html += '</p>'
   })

   html += '</div>'
   html += '</div>'

   return html
}

export const renderStaticNode = (
   runtimeEnv: RuntimeEnv,
   dslType: DSLType,
   node: StaticNode,
): string => {
   if (runtimeEnv === 'web') {
      if (dslType === 'html') {
         console.log(node)

         // 将 characters 进行分割，遇到换行符分组
         let testGroups: StaticTextNode['styledCharacters'][] = groupByNewline(
            node.styledCharacters,
         )
         const content = convertToHtml(testGroups, node)
         console.log('convertToHtml content', content)

         return convertToHtml(testGroups, node)
      }
   }

   return `环境：${runtimeEnv}，DSL 类型：${dslType}，node 类型：${node.type}，还未支持转换成静态代码`
}
