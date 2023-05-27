export function convertTextCaseToCss(textCase: TextCase): string {
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
