/**
 * 此函数将 Figma 中的 LetterSpacing 类型转换为对应的 CSS letter-spacing 属性
 */
export function convertLetterSpacingToCss(letterSpacing: LetterSpacing) {
   let cssObj: Record<string, string> = {}
   if (letterSpacing.value === 0) {
      return cssObj
   }

   if (letterSpacing.unit === 'PIXELS') {
      cssObj['letter-spacing'] = `${letterSpacing.value}px;`
   } else if (letterSpacing.unit === 'PERCENT') {
      cssObj['letter-spacing'] = `${letterSpacing.value / 100}em;`
   }

   return cssObj
}
