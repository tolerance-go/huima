/**
 * 此函数将 Figma 中的 TextDecoration 类型转换为对应的 CSS text-decoration 属性
 */
export function convertTextDecorationToCss(textDecoration: TextDecoration) {
   let cssTextDecoration: Record<string, string> = {}

   switch (textDecoration) {
      case 'UNDERLINE':
         cssTextDecoration['text-decoration'] = 'underline'
         break
      case 'STRIKETHROUGH':
         cssTextDecoration['text-decoration'] = 'line-through'
         break
   }

   return cssTextDecoration
}
