/**
 * 将CSS对象转换为适合内联样式使用的CSS字符串
 * @param css
 * @returns
 */
export function convertCssObjectToString(
   css: Record<string, string | number | null | undefined>,
): string {
   return Object.entries(css)
      .filter(([, value]) => value !== null && value !== undefined)
      .map(([property, value]) => `${property}: ${value};`)
      .join('\n')
}
