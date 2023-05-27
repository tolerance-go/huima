/**
 * 此函数将 Figma 中的 TextDecoration 类型转换为对应的 CSS text-decoration 属性
 */
export function convertTextDecorationToCss(
   textDecoration: TextDecoration,
): string {
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
