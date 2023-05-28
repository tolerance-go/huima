import {
   StaticFrameNode,
   StaticGroupNode,
   StaticTextNode,
} from '@huima/types-next'
import { DSLType, RuntimeEnv } from '../../types'
import { convertAtomNodePositionToCss } from '../convertAtomNodePositionToCss'
import { convertBlendModeToCss } from '../convertBlendModeToCss'
import { convertCssObjectToString } from '../convertCssObjectToString'
import { convertLetterSpacingToCss } from '../convertLetterSpacingToCss'
import { convertRotationToCss } from '../convertRotationToCss'
import { convertTextCaseToCss } from '../convertTextCaseToCss'
import { convertTextDecorationToCss } from '../convertTextDecorationToCss'
import { convertTextEffectsToCss } from '../convertTextEffectsToCss'
import { groupByNewline } from '../groupByNewline'
import { rgbaToHex } from '../rgbaToHex'

/**
 * 要求将 groupByNewline  返回结果进行 html 内容拼接，第一层数组为 p 标签，
 * 第二层每一个元素都为 span 标签包裹，同时把对应属性转换成 css 属性作用到 style 上
 * 
 * 1. 需要支持以下参数 paragraphSpacing：作用到组级 p 标签上，使用 margin-bottom 表示,
      textAutoResize：作用到最外层的 div 标签上，处理 fixed 和 truncate 两种情况，如果是 fixed 需要额外传入 width 和 height 设置到最外层的 div 标签上，fixed 达到的效果是 固定尺寸
      而 truncate 达到的效果是超出部分显示省略号,
      textAlignHorizontal：作用到最外层的 div 标签上，达到横向对齐效果,
      textAlignVertical：作用到最外层的 div 标签上，达到纵向对齐效果
 * 2. options 缩小范围到使用到参数的情况，不需要全部支持
 * 3. figma 中 textAutoResize 的类型 'NONE' | 'WIDTH_AND_HEIGHT' | 'HEIGHT' | 'TRUNCATE'，
 *   fixed 对应的应该是 'NONE'，truncate 对应 'TRUNCATE'
 * 4. p 中不能继续包裹 p 元素，最外层使用 div 包裹，类型为 inline-block
 * 5. figma 中 textAlignHorizontal: 'LEFT' | 'CENTER' | 'RIGHT' | 'JUSTIFIED'
  textAlignVertical: 'TOP' | 'CENTER' | 'BOTTOM'，对应的 css 属性为 text-align 和 vertical-align，需要转换成合法的 css 属性
 * 6. 如果容器是 display：flex 的话，那么 vertical-align 就不起作用了，需要使用 align-items 和 justify-content 来实现
  align-items 需要加上 flex 前缀，同时结构上需要嵌套一层 div，内层的 div 完全包裹内部的文字，文字多大它就多大，自适应内部文字的大小
  7. 将 figma 中的 effects 和 strokes 转换成 css 属性
  8. 将 figma 中的 rotation 转换成 css 属性
  9. 将 figma 中的 constraints 转换成 css 属性
  10. 只有 parentNode 不为空的时候，才需要处理定位
 */
export function convertTextNodeToHtml(
   runtimeEnv: RuntimeEnv,
   dslType: DSLType,
   node: StaticTextNode,
   parentNode?: StaticFrameNode | StaticGroupNode,
): string {
   // 将 characters 进行分割，遇到换行符分组
   let testGroups: StaticTextNode['styledCharacters'][] = groupByNewline(
      node.styledCharacters,
   )

   const groups: StaticTextNode['styledCharacters'][] = testGroups

   let html = ''

   const containerStyleObj = {
      ...convertRotationToCss(node.rotation),
   }

   const containerStyle = `
    ${convertCssObjectToString(containerStyleObj)}
    display: flex;
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
    })(node.textAlignVertical)};
    width: ${node.width}px;
    height: ${node.height}px;
    ${convertBlendModeToCss(node.blendMode)}
    ${convertCssObjectToString(convertAtomNodePositionToCss(node, parentNode))}
  `.trimEnd()

   const effectsCss = convertTextEffectsToCss(node.effects)

   const innerContainerStyle = `
    width: 100%;
    text-align: ${((val) => {
       if (val === 'LEFT') {
          return 'left'
       }
       if (val === 'CENTER') {
          return 'center'
       }
       if (val === 'RIGHT') {
          return 'right'
       }
       if (val === 'JUSTIFIED') {
          return 'justify'
       }
       return 'start'
    })(node.textAlignHorizontal)};
    ${effectsCss}
    `.trimEnd()

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
          index < groups.length - 1 ? node.paragraphSpacing + 'px' : '0'
       };
       ${
          node.textAutoResize === 'TRUNCATE'
             ? 'overflow: hidden; text-overflow: ellipsis; white-space: nowrap;'
             : ''
       }
     `.trimEnd()

      html += `<p style="${groupStyle}">`

      group.forEach((charInfo, charIndex) => {
         // Only process SolidPaint
         const solidFills = charInfo.fills.filter(
            (fill) => fill.type === 'SOLID' && fill.visible !== false,
         ) as SolidPaint[]
         const paint = solidFills.length > 0 ? solidFills[0] : null

         const lineHeight =
            charInfo.lineHeight.unit === 'AUTO'
               ? 'normal'
               : charInfo.lineHeight.unit === 'PIXELS'
               ? `${charInfo.lineHeight.value}px`
               : `${charInfo.lineHeight.value}%`

         const style = `
         font-size: ${charInfo.fontSize}px;
         font-weight: ${charInfo.fontWeight};
         font-family: ${charInfo.fontName.family};
         line-height: ${lineHeight};
         ${convertTextDecorationToCss(charInfo.textDecoration)}
         ${convertTextCaseToCss(charInfo.textCase)}
         ${
            charIndex < group.length - 1
               ? convertLetterSpacingToCss(charInfo.letterSpacing)
               : ''
         }
         ${
            paint
               ? `color: ${rgbaToHex(
                    paint.color.r,
                    paint.color.g,
                    paint.color.b,
                    paint.opacity,
                 )};`
               : ''
         }
       `.trimEnd()
         html += `<span style="${style}">${charInfo.char}</span>`
      })

      html += '</p>'
   })

   html += '</div>'
   html += '</div>'

   return html
}
