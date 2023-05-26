import {
   StaticContainerNode,
   StaticNode,
   StaticRectangleNode,
   StaticTextNode,
} from '@huima/types-next'
import { DSLType, RuntimeEnv } from '../types'

/**
 * 此函数接受一个 Record<string, string | number | null | undefined> 的对象
 * 返回一个 ；分隔的字符串，每行结尾换行，用于生成 css
 */
function generateCss(
   properties: Record<string, string | number | null | undefined>,
): string {
   let css = ''
   for (const property in properties) {
      if (
         properties.hasOwnProperty(property) &&
         properties[property] !== null &&
         properties[property] !== undefined
      ) {
         css += `${property}: ${properties[property]};\n`
      }
   }
   return css
}

/**
 * 这个函数根据传入的 parentAbsoluteBoundingBox 和 absoluteBoundingBox，以及
 * constraints 类型计算出 css 的定位属性，规则如下
 * 当 constraints.horizontal 为 MIN 的情况，使用 absoluteBoundingBox 的 x 作为 left
 * 当 constraints.horizontal 为 MAX 的情况，使用 absoluteBoundingBox 的 x + width 作为 right
 * 当 constraints.horizontal 为 CENTER 的情况，left: calc(50% - width/2 + 相对于父节点中心点水平方向的偏移);
 * 当 constraints.horizontal 为 SCALE 的情况，left 和 right 同时设置固定值
 * 当 constraints.horizontal 为 STRETCH 的情况，left 和 right 同时设置为百分比
 * 水平方向规则同理
 * 始终为绝对定位
 */
function computeCssAbsPosition(
   parentAbsoluteBoundingBox: Rect,
   absoluteBoundingBox: Rect,
   constraints: Constraints,
) {
   let cssPosition: Record<string, string> = {
      position: 'absolute',
   }

   const relativeX = absoluteBoundingBox.x - parentAbsoluteBoundingBox.x
   const relativeY = absoluteBoundingBox.y - parentAbsoluteBoundingBox.y

   switch (constraints.horizontal) {
      case 'MIN':
         cssPosition.left = `${relativeX}px`
         break
      case 'MAX':
         cssPosition.right = `${
            parentAbsoluteBoundingBox.width -
            relativeX -
            absoluteBoundingBox.width
         }px`
         break
      case 'CENTER':
         cssPosition.left = `calc(50% - ${absoluteBoundingBox.width}/2 - ${
            relativeX - parentAbsoluteBoundingBox.width / 2
         }px)`
         break
      case 'SCALE':
         cssPosition.left = `${relativeX}px`
         cssPosition.right = `${
            parentAbsoluteBoundingBox.width -
            relativeX -
            absoluteBoundingBox.width
         }px`
         break
      case 'STRETCH':
         cssPosition.left = `${
            (relativeX / parentAbsoluteBoundingBox.width) * 100
         }%`
         cssPosition.right = `${
            ((parentAbsoluteBoundingBox.width -
               relativeX -
               absoluteBoundingBox.width) /
               parentAbsoluteBoundingBox.width) *
            100
         }%`
         break
   }

   switch (constraints.vertical) {
      case 'MIN':
         cssPosition.top = `${relativeY}px`
         break
      case 'MAX':
         cssPosition.bottom = `${
            parentAbsoluteBoundingBox.width -
            relativeY -
            absoluteBoundingBox.width
         }px`
         break
      case 'CENTER':
         cssPosition.top = `calc(50% - ${absoluteBoundingBox.width}/2 - ${
            relativeY - parentAbsoluteBoundingBox.width / 2
         }px)`
         break
      case 'SCALE':
         cssPosition.top = `${relativeY}px`
         cssPosition.bottom = `${
            parentAbsoluteBoundingBox.width -
            relativeY -
            absoluteBoundingBox.width
         }px`
         break
      case 'STRETCH':
         cssPosition.top = `${
            (relativeY / parentAbsoluteBoundingBox.width) * 100
         }%`
         cssPosition.bottom = `${
            ((parentAbsoluteBoundingBox.width -
               relativeY -
               absoluteBoundingBox.width) /
               parentAbsoluteBoundingBox.width) *
            100
         }%`
         break
   }

   return cssPosition
}

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
function rgbaToHex(r: number, g: number, b: number, a: number = 1): string {
   r = Math.floor(r * 255)
   g = Math.floor(g * 255)
   b = Math.floor(b * 255)
   a = Math.floor(a * 255)
   return (
      '#' +
      ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1) +
      (a < 16 ? '0' : '') +
      a.toString(16)
   )
}

// 只处理了 DROP_SHADOW 和 INNER_SHADOW，其他的暂时不处理，并且只处理了第一个
function convertTextEffectsToCss(effects: readonly Effect[]): string {
   let cssEffects: string = ''

   const supports = effects.filter(
      (effect) =>
         effect.visible &&
         (effect.type === 'DROP_SHADOW' || effect.type === 'INNER_SHADOW'),
   )

   if (supports.length) {
      const effect = supports[0]
      if (effect.type === 'DROP_SHADOW') {
         let shadow = `${effect.offset.x}px ${effect.offset.y}px ${
            effect.radius
         }px ${rgbaToHex(
            effect.color.r,
            effect.color.g,
            effect.color.b,
            effect.color.a,
         )}`
         cssEffects = `text-shadow: ${shadow};`
      } else if (effect.type === 'INNER_SHADOW') {
         let shadow = `inset ${effect.offset.x}px ${effect.offset.y}px ${
            effect.radius
         }px ${rgbaToHex(
            effect.color.r,
            effect.color.g,
            effect.color.b,
            effect.color.a,
         )}`
         cssEffects = `text-shadow: ${shadow};`
      }
   }

   return cssEffects
}

/**
 * 1. 返回一个对象，包含了所有的 css 属性
 * @param effects
 * @returns
 */
function convertFrameEffectsToCss(effects: readonly Effect[]) {
   let cssEffects: Record<string, string> = {}

   const supports = effects.filter(
      (effect) =>
         effect.visible &&
         (effect.type === 'DROP_SHADOW' || effect.type === 'INNER_SHADOW'),
   )

   if (supports.length) {
      const effect = supports[0]
      if (effect.type === 'DROP_SHADOW') {
         let shadow = `${effect.offset.x}px ${effect.offset.y}px ${
            effect.radius
         }px ${rgbaToHex(
            effect.color.r,
            effect.color.g,
            effect.color.b,
            effect.color.a,
         )}`
         cssEffects['box-shadow'] = shadow
      } else if (effect.type === 'INNER_SHADOW') {
         let shadow = `inset ${effect.offset.x}px ${effect.offset.y}px ${
            effect.radius
         }px ${rgbaToHex(
            effect.color.r,
            effect.color.g,
            effect.color.b,
            effect.color.a,
         )}`
         cssEffects['box-shadow'] = shadow
      }
   }

   return cssEffects
}

function convertBlendModeToCss(blendMode: BlendMode): string {
   let cssBlendMode: string

   switch (blendMode) {
      case 'PASS_THROUGH':
      case 'NORMAL':
         cssBlendMode = 'normal'
         break
      case 'DARKEN':
         cssBlendMode = 'darken'
         break
      case 'MULTIPLY':
         cssBlendMode = 'multiply'
         break
      case 'LINEAR_BURN':
      case 'COLOR_BURN':
         cssBlendMode = 'color-burn'
         break
      case 'LIGHTEN':
         cssBlendMode = 'lighten'
         break
      case 'SCREEN':
         cssBlendMode = 'screen'
         break
      case 'LINEAR_DODGE':
      case 'COLOR_DODGE':
         cssBlendMode = 'color-dodge'
         break
      case 'OVERLAY':
         cssBlendMode = 'overlay'
         break
      case 'SOFT_LIGHT':
         cssBlendMode = 'soft-light'
         break
      case 'HARD_LIGHT':
         cssBlendMode = 'hard-light'
         break
      case 'DIFFERENCE':
         cssBlendMode = 'difference'
         break
      case 'EXCLUSION':
         cssBlendMode = 'exclusion'
         break
      case 'HUE':
         cssBlendMode = 'hue'
         break
      case 'SATURATION':
         cssBlendMode = 'saturation'
         break
      case 'COLOR':
         cssBlendMode = 'color'
         break
      case 'LUMINOSITY':
         cssBlendMode = 'luminosity'
         break
      default:
         cssBlendMode = 'normal'
         break
   }

   return `mix-blend-mode: ${cssBlendMode};`
}

function convertTextCaseToCss(textCase: TextCase): string {
   let cssTextTransform: string

   switch (textCase) {
      case 'ORIGINAL':
         cssTextTransform = 'none'
         break
      case 'UPPER':
         cssTextTransform = 'uppercase'
         break
      case 'LOWER':
         cssTextTransform = 'lowercase'
         break
      case 'TITLE':
         cssTextTransform = 'capitalize'
         break
      case 'SMALL_CAPS':
      case 'SMALL_CAPS_FORCED':
         cssTextTransform = 'lowercase'
         break
      default:
         cssTextTransform = 'none'
         break
   }

   return `text-transform: ${cssTextTransform};`
}

/**
 * 此函数将 Figma 中的 TextDecoration 类型转换为对应的 CSS text-decoration 属性
 */
function convertTextDecorationToCss(textDecoration: TextDecoration): string {
   let cssTextDecoration: string = 'text-decoration: '

   switch (textDecoration) {
      case 'UNDERLINE':
         cssTextDecoration += 'underline'
         break
      case 'STRIKETHROUGH':
         cssTextDecoration += 'line-through'
         break
      case 'NONE':
      default:
         // cssTextDecoration += 'none'
         cssTextDecoration = ''
   }

   return cssTextDecoration
}

function convertRotationToCss(rotation: number) {
   return {
      transform: `rotate(${-rotation}deg)`,
   }
}

/**
 * 此函数将 Figma 中的 LetterSpacing 类型转换为对应的 CSS letter-spacing 属性
 */
function convertLetterSpacingToCss(letterSpacing: LetterSpacing): string {
   if (letterSpacing.value === 0) {
      return ''
   }

   let cssLetterSpacing: string = 'letter-spacing: '

   if (letterSpacing.unit === 'PIXELS') {
      cssLetterSpacing += `${letterSpacing.value}px;`
   } else if (letterSpacing.unit === 'PERCENT') {
      cssLetterSpacing += `${letterSpacing.value / 100}em;`
   } else {
      cssLetterSpacing = ''
   }

   return cssLetterSpacing
}

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
function convertTextNodeToHtml(
   groups: StaticTextNode['styledCharacters'][],
   options: Pick<
      StaticTextNode,
      | 'paragraphSpacing'
      | 'textAutoResize'
      | 'textAlignHorizontal'
      | 'textAlignVertical'
      | 'width'
      | 'height'
      | 'effects'
      | 'blendMode'
      | 'rotation'
      | 'constraints'
      | 'parentAbsoluteBoundingBox'
      | 'absoluteBoundingBox'
   >,
   parentNode?: StaticContainerNode,
): string {
   let html = ''

   const containerStyleObj = {
      ...convertRotationToCss(options.rotation),
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
   })(options.textAlignVertical)};
   width: ${options.width}px;
   height: ${options.height}px;
   ${convertBlendModeToCss(options.blendMode)}
   ${
      // TODO: 判断父容器是不是自动布局，同时判断自己是不是绝对定位
      parentNode
         ? generateCss(
              computeCssAbsPosition(
                 // TODO: 找到相对定位的父容器，而不是自己的父容器
                 options.parentAbsoluteBoundingBox!,
                 options.absoluteBoundingBox!,
                 options.constraints,
              ),
           )
         : ''
   }
 `.trimEnd()

   const effectsCss = convertTextEffectsToCss(options.effects)

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
   })(options.textAlignHorizontal)};
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
         index < groups.length - 1 ? options.paragraphSpacing + 'px' : '0'
      };
      ${
         options.textAutoResize === 'TRUNCATE'
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

/**
 * 将Figma的fills转换为CSS的background属性
 * 1. 额外处理渐变色的 fill
 * 2. 如果没有符合条件的 fill，返回 none，而不是抛出异常
 * @param fills
 * @returns
 */
function convertFillsToCss(fills: Paint[]): Record<string, string> {
   const visibleFills = fills.filter((fill) => fill.visible !== false)
   if (visibleFills.length === 0) {
      return {}
   }
   const firstFill = visibleFills[0]
   switch (firstFill.type) {
      case 'SOLID': {
         const { color, opacity } = firstFill as SolidPaint
         return {
            'background-color': rgbaToHex(color.r, color.g, color.b, opacity),
         }
      }
      case 'GRADIENT_LINEAR': {
         const { gradientStops } = firstFill as GradientPaint
         const gradientColors = gradientStops.map(
            (stop) =>
               `${rgbaToHex(
                  stop.color.r,
                  stop.color.g,
                  stop.color.b,
                  stop.color.a,
               )} ${stop.position * 100}%`,
         )
         return { background: `linear-gradient(${gradientColors.join(', ')})` }
      }
      default: {
         return {}
      }
   }
}

/**
 * 将Figma的strokes转换为CSS的border属性
 * 1. 如果没有符合条件的 stroke，返回空对象，而不是抛出异常
 * 2. 处理 solid 和 dashed 两种类型
 * 3. 返回对象形式，而不是字符串形式
 * @param strokes
 * @returns
 */
function convertStrokesToCss(
   strokes: Paint[],
   strokeWeight: number,
   strokeAlign: 'CENTER' | 'INSIDE' | 'OUTSIDE',
   dashPattern: ReadonlyArray<number>,
): Record<string, string> {
   const visibleStrokes = strokes.filter((stroke) => stroke.visible !== false)
   if (visibleStrokes.length === 0) {
      return {}
   }
   const firstStroke = visibleStrokes[0]
   const { color, opacity } = firstStroke as SolidPaint
   const colorString = rgbaToHex(color.r, color.g, color.b, opacity)

   const dashArray = dashPattern ? dashPattern.join(' ') : ''

   switch (strokeAlign) {
      case 'CENTER': {
         // TODO: add support for strokeAlign 'CENTER', which is currently ignored.
         return {
            border: `${strokeWeight}px ${
               dashArray ? 'dashed' : 'solid'
            } ${colorString}`,
         }
      }
      case 'INSIDE': {
         return {
            border: `${strokeWeight}px ${
               dashArray ? 'dashed' : 'solid'
            } ${colorString}`,
            'box-sizing': 'border-box',
         }
      }
      case 'OUTSIDE': {
         return {
            border: `${strokeWeight}px ${
               dashArray ? 'dashed' : 'solid'
            } ${colorString}`,
         }
      }
      default: {
         return {}
      }
   }
}

/**
 * 将CSS对象转换为适合内联样式使用的CSS字符串
 * @param css
 * @returns
 */
function convertCssObjectToString(
   css: Record<string, string | number | null | undefined>,
): string {
   return Object.entries(css)
      .filter(([, value]) => value !== null && value !== undefined)
      .map(([property, value]) => `${property}: ${value};`)
      .join('\n')
}

/**
 * 根据传入的 node，将 figma node 转换成 html 代码
 * 将矩形节点转换成 html 代码
 * 基本结构为一个 div，传入的类型为 StaticRectangleNode
 * 根据参数的 width 和 height 设置 div 的宽高
 * 根据传入的 cornerRadius 设置 div 的圆角
 * 根据传入的 fills 设置 div 的背景色，找到第一个可见 fill，如果没有可见 fill，则设置为空，注意处理渐变色
 * 根据传入的 strokes 设置 div 的边框，找到第一个可见 stroke，如果没有可见 stroke，则设置为空，
 * 注意处理边框的位置信息，比如 center，outside，inside
 * 根据传入的 effects 设置 div 的阴影，找到第一个可见 effect，如果没有可见 effect，则设置为空
 * 根据传入的 rotation 设置 div 的旋转角度
 */
function convertRectangleNodeToHtml(node: StaticRectangleNode): string {
   // 获取 node 中的属性值
   const { width, height, cornerRadius, fills, strokes, effects, rotation } =
      node

   // 转换颜色，边框和效果为 CSS 属性
   const backgroundColorCss = convertFillsToCss(fills as Paint[])
   const borderCss = convertStrokesToCss(
      strokes as Paint[],
      node.strokeWeight as number,
      node.strokeAlign,
      node.dashPattern,
   )
   const boxShadowCss = convertFrameEffectsToCss(effects)
   const transformCss = convertRotationToCss(rotation)

   // 创建 CSS 对象
   const css: Record<string, string | number | null | undefined> = {
      width: `${width}px`,
      height: `${height}px`,
      'border-radius': `${String(cornerRadius)}px`,
      ...backgroundColorCss,
      ...borderCss,
      ...boxShadowCss,
      ...transformCss,
   }

   // 转换 CSS 对象为 CSS 字符串
   const style = convertCssObjectToString(css)

   // 创建 HTML
   const html = `<div style="${style}"></div>`

   return html
}

/**
 * 此函数根据不同的运行环境，DSL 类型，node 类型，将 node 转换成静态代码，
 * 最后渲染到运行环境中，比如浏览器环境
 */
export const renderStaticNode = (
   runtimeEnv: RuntimeEnv,
   dslType: DSLType,
   node: StaticNode,
): string => {
   if (runtimeEnv === 'web') {
      if (dslType === 'html') {
         console.log(node)

         if (node.type === 'text') {
            // 将 characters 进行分割，遇到换行符分组
            let testGroups: StaticTextNode['styledCharacters'][] =
               groupByNewline(node.styledCharacters)
            const content = convertTextNodeToHtml(testGroups, node)
            return content
         }

         if (node.type === 'rectangle') {
            const content = convertRectangleNodeToHtml(node)
            return content
         }

         return ''
      }
   }

   return `环境：${runtimeEnv}，DSL 类型：${dslType}，node 类型：${node.type}，还未支持转换成静态代码`
}
