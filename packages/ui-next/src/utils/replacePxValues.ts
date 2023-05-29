/**
 * 生成一个函数，传递给你一个字符串和一个回调函数，将其中的所有带有 px 单位的数字进行转换，传递给回调函数，用返回值替换
 *
 * @param str
 * @param callback
 * @returns
 */
export function replacePxValues(
   str: string,
   callback: (value: number) => string,
): string {
   const pxValues = str.match(/\d+(\.\d+)?px/g)
   if (pxValues) {
      pxValues.forEach((pxValue) => {
         const numberValue = parseFloat(pxValue)
         const replacement = callback(numberValue)
         str = str.replace(pxValue, replacement)
      })
   }
   return str
}
