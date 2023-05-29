const tailwindMapping = {
   'background-color': (value: string | number) => `bg-[${value}]`,
   'background-size': (value: string | number) => `bg-${value}`,
   'background-repeat': (value: string | number) => `bg-${value}`,
   'border-radius': (value: string | number) => `rounded-[${value}]`,
   'border-color': (value: string | number) => `border-[${value}]`,
   'border-width': (value: string | number) => `border-[${value}]`,
   'border-style': (value: string | number) => `border-${value}`,
   'box-sizing': (value: string | number) =>
      `box-${(value as string).split('-')[0]}`,
   display: (value: string | number) => `${value}`,
   gap: (value: string | number) => `gap-[${value}]`,
   'flex-direction': (value: string | number) => `flex-${value}`,
   'padding-left': (value: string | number) => `pl-[${value}]`,
   'align-items': (value: string | number) => `items-${value}`,
   'justify-content': (value: string | number) => `justify-${value}`,
   position: (value: string | number) => `${value}`,
   left: (value: string | number) => `left-[${value}]`,
   top: (value: string | number) => `top-[${value}]`,
   right: (value: string | number) => `right-[${value}]`,
   bottom: (value: string | number) => `bottom-[${value}]`,
   overflow: (value: string | number) => `overflow-${value}`,
   width: (value: string | number) => `w-[${value}]`,
   height: (value: string | number) => `h-[${value}]`,
}

export function getTailwindClassName(
   key: string,
   value: string | number,
): string | null {
   // 根据 key 实现自定义逻辑，将其映射为 tailwindcss 的 classNames
   // 如果没有相应的 classNames，则返回 null

   if (key in tailwindMapping) {
      return tailwindMapping[key as keyof typeof tailwindMapping](value)
   }

   return null
}
