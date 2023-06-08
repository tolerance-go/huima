export interface UrlParts {
   path: string
   name: string
   id: string
   suffix: string
}

/**
 * 这个函数接受一个字符串，提取其中的 URL，并将其拆分为路径、名称、ID 和后缀等部分，
 * 返回一个包含拆分结果的对象数组。
 * url 前面必须匹配 background-image 和一个可能的空格
 */
export function extractAndSplitBgImgUrls(input: string): UrlParts[] {
   const urlRegex = /background-image\s*:\s*url\(['"]?(.*?)['"]?\)/g
   const urls: UrlParts[] = []
   let match

   while ((match = urlRegex.exec(input)) !== null) {
      const url = match[1]
      const lastIndex = url.lastIndexOf('_')
      const dotIndex = url.lastIndexOf('.')
      const lastSlashIndex = url.lastIndexOf('/')
      const path = url.slice(0, lastSlashIndex)
      const name = url.slice(lastSlashIndex + 1, lastIndex)
      const id = url.slice(lastIndex + 1, dotIndex)
      const suffix = url.slice(dotIndex + 1)
      urls.push({ path, name, id, suffix })
   }

   return urls
}
