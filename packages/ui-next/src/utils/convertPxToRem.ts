/**
 * 这个函数接受一个数字和一个 baseFontSize，返回一个 rem 值
 */
export const convertPxToRem = (value: number, baseFontSize: number) => {
   const remValue = value / baseFontSize + 'rem'
   return remValue
}
