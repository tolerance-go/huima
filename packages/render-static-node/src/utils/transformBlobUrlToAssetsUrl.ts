/**
 * 这个函数接受一个字符串和一个 path，返回一个字符串，
 * 将 url(blob:xxx) 转换为 url(${path}) 的内容，
 */
export function transformBlobUrlToAssetsUrl(html: string, path: string) {
   const regex = /url\((blob:[^)]+)\)/g
   return html.replace(regex, `url(${path})`)
}
