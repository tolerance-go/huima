import { BaseConvertSettings } from '../types'
import { convertPxToRem } from '../utils/convertPxToRem'
import { convertPxToVw } from '../utils/convertPxToVw'
import { replacePxValues } from '../utils/replacePxValues'
import { convertCssObjectToString } from './convertCssObjectToString'
import { getTailwindClassName } from './getTailwindClassName'

/**
 * 这个函数接受一个 Record<string, string | number | undefined | null> 类型的入参，返回一个对象
 * 包括 style 和 class 两个属性
 * class 是将入参转换成一个 classNames 字符串数组，转换规则使用
 * tailwindcss 的类名转换规则，如果没有对应的类名，将剩余的通过 style 属性返回
 */
export function convertToStyleAndClassAttrs(
   input: Record<string, string | number | undefined | null>,
   settings: BaseConvertSettings,
): string {
   const classNames: string[] = []
   let style: Record<string, string | number | undefined | null> = {}

   for (const key in input) {
      let value = input[key]

      if (value === undefined || value === null) {
         continue
      }

      if (typeof value === 'string') {
         value = replacePxValues(value, (val) => {
            if (settings.enablePxConvert) {
               if (settings.pxConvertConfigs.pxConvertFormat === 'rem') {
                  return convertPxToRem(
                     val,
                     settings.pxConvertConfigs.baseFontSize,
                  )
               }
               if (settings.pxConvertConfigs.pxConvertFormat === 'vw') {
                  return convertPxToVw(
                     val,
                     settings.pxConvertConfigs.viewportWidth,
                  )
               }
            }
            return `${val}px`
         })
      }

      if (settings.enableTailwindcss) {
         const className = getTailwindClassName(key, value)

         if (className) {
            classNames.push(className)
            continue
         }
      }

      style[key] = value
   }

   let str = ''

   const styleStr = convertCssObjectToString(style)

   if (styleStr) {
      str += `style="${styleStr}" `
   }

   if (classNames.length) {
      str += `class="${classNames.join(' ')}"`
   }

   return str
}
