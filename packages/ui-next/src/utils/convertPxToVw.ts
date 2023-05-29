/**
 * 这个函数接受一个数字和一个 viewportWidth，返回一个 vw 值
 */
export const convertPxToVw = (value: number, viewportWidth: number) => {
   const vwValue = value / (viewportWidth / 100) + 'vw'
   return vwValue
}
