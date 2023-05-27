/**
 * 此函数将 Figma 中的 LetterSpacing 类型转换为对应的 CSS letter-spacing 属性
 */
export function convertLetterSpacingToCss(
   letterSpacing: LetterSpacing,
): string {
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
