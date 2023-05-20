import { CSSStyle } from '@huima/types'
import { RemoveNullOrUndefined } from '@huima/utils'

const tailwindMapping = {
   'background-color': (value: string | number, cssStyle: CSSStyle) =>
      `bg-[${value}]`,
   'background-size': (value: string | number, cssStyle: CSSStyle) =>
      `bg-${value}`,
   'background-repeat': (value: string | number, cssStyle: CSSStyle) =>
      `bg-${value}`,
   'border-radius': (value: string | number, cssStyle: CSSStyle) =>
      `rounded-[${value}]`,
   'border-color': (value: string | number, cssStyle: CSSStyle) =>
      `border-[${value}]`,
   'border-width': (value: string | number, cssStyle: CSSStyle) =>
      `border-[${value}]`,
   'border-style': (value: string | number, cssStyle: CSSStyle) =>
      `border-${value}`,
   'box-sizing': (value: string | number, cssStyle: CSSStyle) =>
      `box-${(value as string).split('-')[0]}`,
   display: (value: string | number, cssStyle: CSSStyle) => `${value}`,
   gap: (value: string | number, cssStyle: CSSStyle) => `gap-[${value}]`,
   'flex-direction': (value: string | number, cssStyle: CSSStyle) =>
      `flex-${value}`,
   'padding-left': (value: string | number, cssStyle: CSSStyle) =>
      `pl-[${value}]`,
   'align-items': (value: string | number, cssStyle: CSSStyle) =>
      `items-${value}`,
   'justify-content': (value: string | number, cssStyle: CSSStyle) =>
      `justify-${value}`,
   position: (value: string | number, cssStyle: CSSStyle) => `${value}`,
   left: (value: string | number, cssStyle: CSSStyle) => `left-[${value}]`,
   top: (value: string | number, cssStyle: CSSStyle) => `top-[${value}]`,
   right: (value: string | number, cssStyle: CSSStyle) => `right-[${value}]`,
   bottom: (value: string | number, cssStyle: CSSStyle) => `bottom-[${value}]`,
   overflow: (value: string | number, cssStyle: CSSStyle) =>
      `overflow-${value}`,
   width: (value: string | number, cssStyle: CSSStyle) => `w-[${value}]`,
   height: (value: string | number, cssStyle: CSSStyle) => `h-[${value}]`,
}

export const convertInlineStyleToTailwindcss = (styleString: string) => {
   let tailwindClasses: string[] = []
   let remainingStyles: string = ''

   // 转换样式字符串为对象
   let cssStyle = styleString
      .split(';')
      .filter((style) => style.trim() !== '')
      .reduce((acc, curr) => {
         let [key, value] = curr.split(':').map((v) => v.trim())
         acc[key] = value
         return acc
      }, {} as RemoveNullOrUndefined<CSSStyle>)

   Object.keys(cssStyle).forEach((key) => {
      if (key in tailwindMapping) {
         // 将 key 断言为 tailwindMapping 的键的类型
         const typedKey = key as keyof typeof tailwindMapping

         tailwindClasses.push(
            tailwindMapping[typedKey](cssStyle[key], cssStyle),
         )
      } else {
         remainingStyles += `${key}: ${cssStyle[key]}; `
      }
   })

   return {
      className: tailwindClasses.join(' '),
      inlineStyle: remainingStyles,
   }
}
