/**
 * 这个函数接受 figma 的 id，由于 figma 中 id 会用 : 进行分隔
 * 所以这里需要将 : 替换成 -，以便在 HTML 中使用
 */
export function convertFigmaIdToHtmlId(figmaId: string): string {
   return figmaId.replace(/:/g, '-')
}

/**
 * 将 htmlId 转换成 figmaId
 */
export function convertHtmlIdToFigmaId(htmlId: string): string {
   return htmlId.replace(/-/g, ':')
}
