import {
   ImageFillMeta,
   Point,
   StaticBooleanOperationNode,
   StaticEllipseNode,
   StaticFrameNode,
   StaticGroupNode,
   StaticLineNode,
   StaticNode,
   StaticPolygonNode,
   StaticRectangleNode,
   StaticStarNode,
   StaticTextNode,
   StaticVectorNode,
} from '@huima/types-next'
import { Buffer } from 'buffer'
import { DSLType, RuntimeEnv } from '../types'
import {
   getCenterPoint,
   relativePoint,
   rotatePoint,
} from '../utils/rotatePoint'
import { getFrameFlexLayoutStyle } from './getFrameFlexLayoutStyle'

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
 * 1. 传入父节点的旋转角度和当前节点的旋转角度，在计算 relativeX 和 relativeY 时，需要考虑旋转角度
 * 先计算出各自旋转前的坐标，用它们计算出相对于父节点的坐标，因为 css 的旋转是以旋转前的坐标旋转的
 */
function computeCssAbsPosition({
   rotatedUpperLeft,
   parentAbsoluteBoundingBox,
   absoluteBoundingBox,
   constraints,
   rotation,
}: {
   rotatedUpperLeft: Point
   parentAbsoluteBoundingBox: Rect
   absoluteBoundingBox: Rect
   constraints: Constraints
   rotation: number
}) {
   let cssPosition: Record<string, string> = {
      position: 'absolute',
   }

   // node 的 x，y 是相对于父节点的 absBoundingRect 的
   const beforeRotateBox = rotatePoint(
      rotatedUpperLeft,
      relativePoint(
         getCenterPoint(absoluteBoundingBox),
         parentAbsoluteBoundingBox,
      ),
      rotation,
   )

   switch (constraints.horizontal) {
      case 'MIN':
         cssPosition.left = `${beforeRotateBox.x}px`
         break
      case 'MAX':
         cssPosition.right = `${
            parentAbsoluteBoundingBox.width -
            beforeRotateBox.x -
            absoluteBoundingBox.width
         }px`
         break
      case 'CENTER':
         cssPosition.left = `calc(50% - ${absoluteBoundingBox.width}px/2 - ${
            parentAbsoluteBoundingBox.width / 2 -
            absoluteBoundingBox.width / 2 -
            beforeRotateBox.x
         }px)`
         break
      case 'SCALE':
         cssPosition.left = `${beforeRotateBox.x}px`
         cssPosition.right = `${
            parentAbsoluteBoundingBox.width -
            beforeRotateBox.x -
            absoluteBoundingBox.width
         }px`
         break
      case 'STRETCH':
         cssPosition.left = `${
            (beforeRotateBox.x / parentAbsoluteBoundingBox.width) * 100
         }%`
         cssPosition.right = `${
            ((parentAbsoluteBoundingBox.width -
               beforeRotateBox.x -
               absoluteBoundingBox.width) /
               parentAbsoluteBoundingBox.width) *
            100
         }%`
         break
   }

   switch (constraints.vertical) {
      case 'MIN':
         cssPosition.top = `${beforeRotateBox.y}px`
         break
      case 'MAX':
         cssPosition.bottom = `${
            parentAbsoluteBoundingBox.height -
            beforeRotateBox.y -
            absoluteBoundingBox.height
         }px`
         break
      case 'CENTER':
         cssPosition.top = `calc(50% - ${absoluteBoundingBox.height}px/2 - ${
            parentAbsoluteBoundingBox.height / 2 -
            absoluteBoundingBox.height / 2 -
            beforeRotateBox.y
         }px)`
         break
      case 'SCALE':
         cssPosition.top = `${beforeRotateBox.y}px`
         cssPosition.bottom = `${
            parentAbsoluteBoundingBox.height -
            beforeRotateBox.y -
            absoluteBoundingBox.height
         }px`
         break
      case 'STRETCH':
         cssPosition.top = `${
            (beforeRotateBox.y / parentAbsoluteBoundingBox.height) * 100
         }%`
         cssPosition.bottom = `${
            ((parentAbsoluteBoundingBox.height -
               beforeRotateBox.y -
               absoluteBoundingBox.height) /
               parentAbsoluteBoundingBox.height) *
            100
         }%`
         break
   }

   return cssPosition
}

/**
 *
 * 1. 生成的 svg 是已经旋转过后的了，所以不需要考虑旋转的问题
 * 2. 根据传入的 absoluteBoundingBox 和 parentAbsoluteBoundingBox 计算出相对于父节点的 x，y，然后根据 constraints 计算出 left，right，top，bottom
 *
 * @param param0
 * @returns
 */
function computeVectorCssAbsPosition({
   parentAbsoluteRenderBox: parentAbsoluteRenderBox,
   absoluteRenderBox: absoluteRenderBox,
   constraints,
}: {
   parentAbsoluteRenderBox: Rect
   absoluteRenderBox: Rect
   constraints: Constraints
}) {
   let cssPosition: Record<string, string> = {
      position: 'absolute',
   }

   const upperLeft = relativePoint(absoluteRenderBox, parentAbsoluteRenderBox)

   switch (constraints.horizontal) {
      case 'MIN':
         cssPosition.left = `${upperLeft.x}px`
         break
      case 'MAX':
         cssPosition.right = `${
            parentAbsoluteRenderBox.width -
            upperLeft.x -
            absoluteRenderBox.width
         }px`
         break
      case 'CENTER':
         cssPosition.left = `calc(50% - ${absoluteRenderBox.width}px/2 - ${
            parentAbsoluteRenderBox.width / 2 -
            absoluteRenderBox.width / 2 -
            upperLeft.x
         }px)`
         break
      case 'SCALE':
         cssPosition.left = `${upperLeft.x}px`
         cssPosition.right = `${
            parentAbsoluteRenderBox.width -
            upperLeft.x -
            absoluteRenderBox.width
         }px`
         break
      case 'STRETCH':
         cssPosition.left = `${
            (upperLeft.x / parentAbsoluteRenderBox.width) * 100
         }%`
         cssPosition.right = `${
            ((parentAbsoluteRenderBox.width -
               upperLeft.x -
               absoluteRenderBox.width) /
               parentAbsoluteRenderBox.width) *
            100
         }%`
         break
   }

   switch (constraints.vertical) {
      case 'MIN':
         cssPosition.top = `${upperLeft.y}px`
         break
      case 'MAX':
         cssPosition.bottom = `${
            parentAbsoluteRenderBox.height -
            upperLeft.y -
            absoluteRenderBox.height
         }px`
         break
      case 'CENTER':
         cssPosition.top = `calc(50% - ${absoluteRenderBox.height}px/2 - ${
            parentAbsoluteRenderBox.height / 2 -
            absoluteRenderBox.height / 2 -
            upperLeft.y
         }px)`
         break
      case 'SCALE':
         cssPosition.top = `${upperLeft.y}px`
         cssPosition.bottom = `${
            parentAbsoluteRenderBox.height -
            upperLeft.y -
            absoluteRenderBox.height
         }px`
         break
      case 'STRETCH':
         cssPosition.top = `${
            (upperLeft.y / parentAbsoluteRenderBox.height) * 100
         }%`
         cssPosition.bottom = `${
            ((parentAbsoluteRenderBox.height -
               upperLeft.y -
               absoluteRenderBox.height) /
               parentAbsoluteRenderBox.height) *
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
   ${
      // TODO: 判断父容器是不是自动布局，同时判断自己是不是绝对定位
      parentNode
         ? convertCssObjectToString(
              computeCssAbsPosition({
                 rotatedUpperLeft: {
                    x: node.x,
                    y: node.y,
                 },
                 parentAbsoluteBoundingBox: parentNode.absoluteBoundingBox!,
                 absoluteBoundingBox: node.absoluteBoundingBox!,
                 constraints: node.constraints,
                 rotation: node.rotation,
              }),
           )
         : ''
   }
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

/**
 * 将Figma的fills转换为CSS的background属性
 * 1. 额外处理渐变色的 fill
 * 2. 如果没有符合条件的 fill，返回 none，而不是抛出异常
 * 3. 处理图片的 fill，需要处理 figma 中的各种填充模式
 * @param fills
 * @returns
 */
function convertFillsToCss(
   fills: Paint[],
   imageFillMeta?: ImageFillMeta,
): Record<string, string> {
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
      case 'IMAGE': {
         if (!imageFillMeta) return {}

         const imageFill = firstFill as ImagePaint
         const backgroundSize =
            imageFill.scaleMode === 'FILL' ? 'cover' : 'contain'

         const url = URL.createObjectURL(
            new Blob([imageFillMeta!.imageBytes], {
               type: `image/${imageFillMeta!.imageExtension}`,
            }),
         )
         const backgroundImage = `url(${url})`

         return {
            'background-image': backgroundImage,
            'background-size': backgroundSize,
            'background-repeat': 'no-repeat',
            'background-position': 'center',
         }
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

const convertBorderRadiusToCss = (radius: string) => {
   return {
      'border-radius': `${radius}px`,
   }
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
function convertRectangleNodeToHtml(
   runtimeEnv: RuntimeEnv,
   dslType: DSLType,
   node: StaticRectangleNode,
   parentNode?: StaticFrameNode | StaticGroupNode,
): string {
   // 获取 node 中的属性值
   const { width, height, cornerRadius, fills, strokes, effects, rotation } =
      node

   // 转换颜色，边框和效果为 CSS 属性
   const backgroundColorCss = convertFillsToCss(
      fills as Paint[],
      node.imageFillMeta,
   )
   const borderCss = convertStrokesToCss(
      strokes as Paint[],
      node.strokeWeight as number,
      node.strokeAlign,
      node.dashPattern,
   )
   const boxShadowCss = convertFrameEffectsToCss(effects)
   const transformCss = convertRotationToCss(rotation)

   // 如果一路查找祖先 parent 的过程中，都是 group，并且最后一个 group 的父级是空或者是 frame 且是 autoLayout 布局
   // 这个条件下，Group 容器渲染为一个 div 元素的
   const getParentsGroupIsRoot = () => {
      let parent = parentNode
      while (parent) {
         if (parent.type !== 'group') return { isParentsGroupIsRoot: false }
         if (
            !parent.parent ||
            (parent.parent.type === 'frame' &&
               parent.parent.layoutMode !== 'NONE')
         )
            return { isParentsGroupIsRoot: true, rootGroup: parent }
         parent = parent.parent
      }
      return { isParentsGroupIsRoot: false }
   }

   const { isParentsGroupIsRoot, rootGroup } = getParentsGroupIsRoot()

   // 创建 CSS 对象
   const css: Record<string, string | number | null | undefined> = {
      width: `${width}px`,
      height: `${height}px`,
      ...convertBorderRadiusToCss(String(cornerRadius)),
      ...backgroundColorCss,
      ...borderCss,
      ...boxShadowCss,
      ...transformCss,
      ...(parentNode &&
      (isParentsGroupIsRoot ||
         (parentNode.type === 'frame' && parentNode.layoutMode === 'NONE') ||
         node.layoutPositioning === 'ABSOLUTE')
         ? computeCssAbsPosition({
              rotatedUpperLeft: isParentsGroupIsRoot
                 ? relativePoint(
                      {
                         x: node.x,
                         y: node.y,
                      },
                      {
                         x: rootGroup!.x,
                         y: rootGroup!.y,
                      },
                   )
                 : {
                      x: node.x,
                      y: node.y,
                   },
              parentAbsoluteBoundingBox: isParentsGroupIsRoot
                 ? rootGroup!.absoluteBoundingBox!
                 : parentNode.absoluteBoundingBox!,
              absoluteBoundingBox: node.absoluteBoundingBox!,
              constraints: node.constraints,
              rotation: node.rotation,
           })
         : {}),
   }

   // 转换 CSS 对象为 CSS 字符串
   const style = convertCssObjectToString(css)

   // 创建 HTML
   const html = `<div style="${style}"></div>`

   return html
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
function convertEllipseNodeToHtml(
   runtimeEnv: RuntimeEnv,
   dslType: DSLType,
   node: StaticEllipseNode,
   parentNode?: StaticFrameNode | StaticGroupNode,
): string {
   // 获取 node 中的属性值
   const { width, height, cornerRadius, fills, strokes, effects, rotation } =
      node

   // 转换颜色，边框和效果为 CSS 属性
   const backgroundColorCss = convertFillsToCss(
      fills as Paint[],
      node.imageFillMeta,
   )
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
      'border-radius': '100%',
      ...backgroundColorCss,
      ...borderCss,
      ...boxShadowCss,
      ...transformCss,
      // TODO: 判断父容器是不是自动布局，同时判断自己是不是绝对定位
      ...(parentNode
         ? computeCssAbsPosition({
              rotatedUpperLeft: {
                 x: node.x,
                 y: node.y,
              },
              parentAbsoluteBoundingBox: parentNode.absoluteBoundingBox!,
              absoluteBoundingBox: node.absoluteBoundingBox!,
              constraints: node.constraints,
              rotation: node.rotation,
           })
         : {}),
   }

   // 转换 CSS 对象为 CSS 字符串
   const style = convertCssObjectToString(css)

   // 创建 HTML
   const html = `<div style="${style}"></div>`

   return html
}

/**
 * 函数根据传入的 node，将 figma node 转换成 html 代码
 * 如果父节点是 group，并且父节点是根节点，需要设置绝对定位
 * @param node
 */
const convertFrameNodeToHtml = (
   runtimeEnv: RuntimeEnv,
   dslType: DSLType,
   node: StaticFrameNode,
   parentNode?: StaticFrameNode | StaticGroupNode,
): string => {
   const {
      width,
      height,
      fills,
      strokes,
      effects,
      cornerRadius,
      rotation,
      children,
   } = node

   // 转换颜色，边框和效果为 CSS 属性
   const backgroundColorCss = convertFillsToCss(
      fills as Paint[],
      node.imageFillMeta,
   )
   const borderCss = convertStrokesToCss(
      strokes as Paint[],
      node.strokeWeight as number,
      node.strokeAlign,
      node.dashPattern,
   )
   const boxShadowCss = convertFrameEffectsToCss(effects)
   const transformCss = convertRotationToCss(rotation)

   console.log('parentNode', parentNode)

   // 创建 CSS 对象
   const css: Record<string, string | number | null | undefined> = {
      width: `${width}px`,
      height: `${height}px`,
      ...getFrameFlexLayoutStyle(node),
      ...convertBorderRadiusToCss(String(cornerRadius)),
      ...backgroundColorCss,
      ...borderCss,
      ...boxShadowCss,
      ...transformCss,
      ...(parentNode &&
      ((parentNode.type === 'group' && !parentNode.parent) ||
         (parentNode.type === 'frame' && parentNode.layoutMode === 'NONE') ||
         node.layoutPositioning === 'ABSOLUTE')
         ? computeCssAbsPosition({
              rotatedUpperLeft: {
                 x: node.x,
                 y: node.y,
              },
              parentAbsoluteBoundingBox: parentNode.absoluteBoundingBox!,
              absoluteBoundingBox: node.absoluteBoundingBox!,
              constraints: node.constraints,
              rotation: node.rotation,
           })
         : {}),
   }

   // 转换 CSS 对象为 CSS 字符串
   const style = convertCssObjectToString(css)

   // 创建 HTML
   const html = `<div role='frame' style="${style}">
   ${children
      .map((item) => {
         return renderStaticNode(runtimeEnv, dslType, item, node)
      })
      .join('\n')}</div>`

   return html
}

/**
 * 根据传入的 node，将 figma node 转换成 html 代码
 * 将 line 转换成 svg 代码
 * 他不处理旋转，生成的 svg 代码已经是旋转过后的了，后期也可以直接当图用
 * 所以 x 和 y，我们这里使用 absoluteBoundingBox 的数据
 * @param runtimeEnv
 * @param dslType
 * @param node
 * @param parentNode
 */
const convertLineNodeToHtml = (
   runtimeEnv: RuntimeEnv,
   dslType: DSLType,
   node: StaticLineNode,
   parentNode?: StaticFrameNode | StaticGroupNode,
) => {
   const { width, height, fills, strokes, effects, rotation } = node

   const html = Buffer.from(node.svgBytes).toString()

   // 创建 CSS 对象
   const css: Record<string, string | number | null | undefined> = {
      // TODO: 判断父容器是不是自动布局，同时判断自己是不是绝对定位
      ...(parentNode
         ? computeVectorCssAbsPosition({
              parentAbsoluteRenderBox: parentNode.absoluteRenderBounds!,
              absoluteRenderBox: node.absoluteRenderBounds!,
              constraints: node.constraints,
           })
         : {}),
   }

   // 转换 CSS 对象为 CSS 字符串
   const style = convertCssObjectToString(css)

   return html.replace('<svg', `<svg role='line' style="${style}"`)
}

/**
 * 根据传入的 node，将 figma node 转换成 html 代码
 * 将 vector 转换成 svg 代码
 * @param runtimeEnv
 * @param dslType
 * @param node
 * @param parentNode
 */
const convertVectorNodeToHtml = (
   runtimeEnv: RuntimeEnv,
   dslType: DSLType,
   node: StaticVectorNode,
   parentNode?: StaticFrameNode | StaticGroupNode,
) => {
   const { width, height, fills, strokes, effects, rotation } = node

   const html = Buffer.from(node.svgBytes).toString()

   // 创建 CSS 对象
   const css: Record<string, string | number | null | undefined> = {
      // TODO: 判断父容器是不是自动布局，同时判断自己是不是绝对定位
      ...(parentNode
         ? computeVectorCssAbsPosition({
              parentAbsoluteRenderBox: parentNode.absoluteRenderBounds!,
              absoluteRenderBox: node.absoluteRenderBounds!,
              constraints: node.constraints,
           })
         : {}),
   }

   // 转换 CSS 对象为 CSS 字符串
   const style = convertCssObjectToString(css)

   return html.replace('<svg', `<svg role='vector' style="${style}"`)
}

const convertBooleanOperationNodeToHtml = (
   runtimeEnv: RuntimeEnv,
   dslType: DSLType,
   node: StaticBooleanOperationNode,
   parentNode?: StaticFrameNode | StaticGroupNode,
) => {
   const { width, height, fills, strokes, effects, rotation } = node

   const html = Buffer.from(node.svgBytes).toString()

   // 创建 CSS 对象
   const css: Record<string, string | number | null | undefined> = {
      // TODO: 判断父容器是不是自动布局，同时判断自己是不是绝对定位
      ...(parentNode
         ? computeVectorCssAbsPosition({
              parentAbsoluteRenderBox: parentNode.absoluteRenderBounds!,
              absoluteRenderBox: node.absoluteRenderBounds!,
              constraints: {
                 horizontal: 'MIN',
                 vertical: 'MIN',
              },
           })
         : {}),
   }

   // 转换 CSS 对象为 CSS 字符串
   const style = convertCssObjectToString(css)

   return html.replace('<svg', `<svg role='vector' style="${style}"`)
}

/**
 * 根据传入的 node，将 figma node 转换成 html 代码
 * 将 vector 转换成 svg 代码
 * @param runtimeEnv
 * @param dslType
 * @param node
 * @param parentNode
 */
const convertStarNodeToHtml = (
   runtimeEnv: RuntimeEnv,
   dslType: DSLType,
   node: StaticStarNode,
   parentNode?: StaticFrameNode | StaticGroupNode,
) => {
   const { width, height, fills, strokes, effects, rotation } = node

   const html = Buffer.from(node.svgBytes).toString()

   // 创建 CSS 对象
   const css: Record<string, string | number | null | undefined> = {
      // TODO: 判断父容器是不是自动布局，同时判断自己是不是绝对定位
      ...(parentNode
         ? computeVectorCssAbsPosition({
              parentAbsoluteRenderBox: parentNode.absoluteRenderBounds!,
              absoluteRenderBox: node.absoluteRenderBounds!,
              constraints: node.constraints,
           })
         : {}),
   }

   // 转换 CSS 对象为 CSS 字符串
   const style = convertCssObjectToString(css)

   return html.replace('<svg', `<svg role='star' style="${style}"`)
}

/**
 * 根据传入的 node，将 figma node 转换成 html 代码
 * 将 vector 转换成 svg 代码
 * @param runtimeEnv
 * @param dslType
 * @param node
 * @param parentNode
 */
const convertPolygonNodeToHtml = (
   runtimeEnv: RuntimeEnv,
   dslType: DSLType,
   node: StaticPolygonNode,
   parentNode?: StaticFrameNode | StaticGroupNode,
) => {
   const { width, height, fills, strokes, effects, rotation } = node

   const html = Buffer.from(node.svgBytes).toString()

   // 创建 CSS 对象
   const css: Record<string, string | number | null | undefined> = {
      // TODO: 判断父容器是不是自动布局，同时判断自己是不是绝对定位
      ...(parentNode
         ? computeVectorCssAbsPosition({
              parentAbsoluteRenderBox: parentNode.absoluteRenderBounds!,
              absoluteRenderBox: node.absoluteRenderBounds!,
              constraints: node.constraints,
           })
         : {}),
   }

   // 转换 CSS 对象为 CSS 字符串
   const style = convertCssObjectToString(css)

   return html.replace('<svg', `<svg role='polygon' style="${style}"`)
}

function convertEffectsToFilter(
   effects: readonly Effect[],
): Record<string, string | null> {
   let cssFilter = null
   const dropShadowEffect = effects.find(
      (effect) => effect.type === 'DROP_SHADOW' && effect.visible !== false,
   ) as DropShadowEffect | undefined

   if (dropShadowEffect) {
      const { offset, radius, color } = dropShadowEffect
      cssFilter = `drop-shadow(${offset.x}px ${
         offset.y
      }px ${radius}px ${rgbaToHex(color.r, color.g, color.b, color.a)})`
   }

   return {
      filter: cssFilter,
   }
}

/**
 * 作为根节点渲染的时候，或者父节点是 autoLayout，使用 div 元素
 * 如果作为子节点渲染的时候，直接跳过
 * group 需要渲染 gap，但是就用子节点的绝对定位实现即可
 *
 * @param runtimeEnv
 * @param dslType
 * @param node
 * @param parentNode
 * @returns
 */
const convertGroupNodeToHtml = (
   runtimeEnv: RuntimeEnv,
   dslType: DSLType,
   node: StaticGroupNode,
   parentNode?: StaticFrameNode | StaticGroupNode,
): string => {
   const { width, height, effects, rotation, children } = node

   // 创建 CSS 对象
   const css: Record<string, string | number | null | undefined> = {
      width: `${width}px`,
      height: `${height}px`,
      ...convertEffectsToFilter(effects),
      ...convertRotationToCss(rotation),
      ...(parentNode &&
      parentNode.type === 'frame' &&
      parentNode.layoutMode !== 'NONE' &&
      node.layoutPositioning === 'ABSOLUTE'
         ? computeCssAbsPosition({
              rotatedUpperLeft: {
                 x: node.x,
                 y: node.y,
              },
              parentAbsoluteBoundingBox: parentNode.absoluteBoundingBox!,
              absoluteBoundingBox: node.absoluteBoundingBox!,
              constraints: {
                 horizontal: 'MIN',
                 vertical: 'MIN',
              },
              rotation: node.rotation,
           })
         : {}),
   }

   // 转换 CSS 对象为 CSS 字符串
   const style = convertCssObjectToString(css)

   const childrenHtml = children
      .map((item) => {
         return renderStaticNode(runtimeEnv, dslType, item, node)
      })
      .join('\n')

   // 存在父节点，且不是 frame + autoLayout，直接跳过返回子节点
   if (
      parentNode &&
      !(parentNode.type === 'frame' && parentNode.layoutMode !== 'NONE')
   ) {
      return childrenHtml
   }

   // 如果为根节点
   const html = `<div role="group" style="${style}">${childrenHtml}</div>`

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
   parentNode?: StaticFrameNode | StaticGroupNode,
): string => {
   if (runtimeEnv === 'web') {
      if (dslType === 'html') {
         console.log(node)

         if (node.type === 'text') {
            const content = convertTextNodeToHtml(
               runtimeEnv,
               dslType,
               node,
               parentNode,
            )
            return content
         }

         if (node.type === 'rectangle') {
            const content = convertRectangleNodeToHtml(
               runtimeEnv,
               dslType,
               node,
               parentNode,
            )
            return content
         }

         if (node.type === 'ellipse') {
            const content = convertEllipseNodeToHtml(
               runtimeEnv,
               dslType,
               node,
               parentNode,
            )
            return content
         }

         if (node.type === 'frame') {
            const content = convertFrameNodeToHtml(
               runtimeEnv,
               dslType,
               node,
               parentNode,
            )
            return content
         }

         if (node.type === 'group') {
            const content = convertGroupNodeToHtml(
               runtimeEnv,
               dslType,
               node,
               parentNode,
            )
            return content
         }

         if (node.type === 'line') {
            const content = convertLineNodeToHtml(
               runtimeEnv,
               dslType,
               node,
               parentNode,
            )
            return content
         }

         if (node.type === 'vector') {
            const content = convertVectorNodeToHtml(
               runtimeEnv,
               dslType,
               node,
               parentNode,
            )
            return content
         }

         if (node.type === 'booleanOperation') {
            const content = convertBooleanOperationNodeToHtml(
               runtimeEnv,
               dslType,
               node,
               parentNode,
            )
            return content
         }

         if (node.type === 'polygon') {
            const content = convertPolygonNodeToHtml(
               runtimeEnv,
               dslType,
               node,
               parentNode,
            )
            return content
         }

         if (node.type === 'star') {
            const content = convertStarNodeToHtml(
               runtimeEnv,
               dslType,
               node,
               parentNode,
            )
            return content
         }

         return ''
      }
   }

   return `环境：${runtimeEnv}，DSL 类型：${dslType}，node 类型：${node.type}，还未支持转换成静态代码`
}
