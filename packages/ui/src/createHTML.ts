import {
   BackgroundImageMeta,
   CSSStyle,
   NodeTree,
   StyleMeta,
} from '@huima/types'
import { getGroupChildrenPosition } from './getGroupChildrenPosition'

type Options = {
   getBgImgUrl?: (bgImgMeta: BackgroundImageMeta, node: NodeTree) => string
   convertPxValue?: (value: number) => string
   convertStyle?: (style: string) => {
      className: string
      inlineStyle: string
   }
}

export function createHTML(
   node: NodeTree,
   options?: Options,
   indent = 0,
): string {
   const { convertPxValue, convertStyle } = options ?? ({} as Options)

   const getStyleAttrs = (style: CSSStyle, styleMeta?: StyleMeta) => {
      const { className, inlineStyle } = getStyle(style, styleMeta)

      return [
         className ? `class="${className}"` : null,
         `style="${inlineStyle}"`,
      ]
         .filter(Boolean)
         .join(' ')
   }

   const getStyle = (style: CSSStyle, styleMeta?: StyleMeta) => {
      const styleString = Object.entries(createCss(style, styleMeta))
         .map(([key, value]) => `${key}: ${value};`)
         .join(' ')

      if (convertStyle) {
         return convertStyle(styleString)
      }

      return {
         className: '',
         inlineStyle: styleString,
      }
   }

   const createCss = (nodeStyle: CSSStyle, styleMeta?: StyleMeta) => {
      console.log('createStyle', nodeStyle)
      let style: CSSStyle = {}
      for (const key in nodeStyle) {
         const value = nodeStyle[key]

         if (convertPxValue) {
            // 判断 value 是否是 px 值
            if (typeof value === 'string' && value.includes('px')) {
               // 使用正则表达式找出所有的 px 值
               // 这样，你的代码现在应该能够正确地处理像 10.5px 这样的小数像素值了
               let pxValues = value.match(/\d+(\.\d+)?px/g)
               if (pxValues) {
                  pxValues.forEach((pxValue) => {
                     // 转换 px 值为 rem 值，并替换原来的 px 值
                     let numberValue = parseFloat(pxValue)
                     let remValue = convertPxValue!(numberValue)
                     style[key] = value.replace(pxValue, remValue)
                  })
                  // 注意不要被后面的 style[key] = nodeStyle[key] 覆盖
                  continue
               }
            }
         }

         if (
            key === 'background-image' &&
            nodeStyle[key] &&
            styleMeta?.backgroundImageMeta
         ) {
            if (options?.getBgImgUrl) {
               style[key] = `url('${options.getBgImgUrl(
                  styleMeta.backgroundImageMeta,
                  node,
               )}')`
               continue
            }

            const {
               backgroundImageBytes,
               backgroundImageExtension,
               backgroundImageByteLength,
            } = styleMeta.backgroundImageMeta

            let sizeInKB = backgroundImageByteLength / 1024

            // 如果用 createObjectURL，是不是每次都需要 revoke，可能会有性能问题，关闭浏览器就自动释放了
            // 小图片直接用 base64，大图片用 createObjectURL，减少网络请求
            if (sizeInKB < 10) {
               // 不引入 Buffer 库，减少体积
               const base64Image = window.btoa(
                  String.fromCharCode(...new Uint8Array(backgroundImageBytes)),
               )

               style[
                  key
               ] = `url('data:image/${backgroundImageExtension};base64,${base64Image}')`
            } else {
               const url = URL.createObjectURL(
                  new Blob([backgroundImageBytes], {
                     type: `image/${backgroundImageExtension}`,
                  }),
               )
               style[key] = `url('${url}')`
            }

            continue
         }

         style[key] = nodeStyle[key]
      }

      return style
   }

   console.log('createHTML', node)

   if (node.nodeInfo.visible === false) return ''

   if (node.element) {
      return node.element.replace(
         `<${node.tag}`,
         `<${node.tag} ${getStyleAttrs(node.style, node.styleMeta)}`,
      )
   }

   const childrenString = node.children
      .map((child) => `${createHTML(child, options, indent + 1)}`)
      .join('')

   if (node.nodeInfo.type === 'GROUP') {
      // Group 第一层子元素坐标位置需要进行偏移计算
      // 如果 Group 在一个 auto layout 节点内，那么当做一个 div 进行渲染
      if (
         indent === 0 ||
         (node.nodeInfo.parentNodeInfo &&
            'layoutMode' in node.nodeInfo.parentNodeInfo &&
            node.nodeInfo.parentNodeInfo.layoutMode !== 'NONE')
      ) {
         return `<${node.tag} ${getStyleAttrs(node.style, node.styleMeta)}>
${node.children
   .map(
      (child) =>
         `${createHTML(
            {
               ...child,
               style: {
                  ...child.style,
                  left:
                     getGroupChildrenPosition(
                        child.nodeInfo.x,
                        node.nodeInfo.x,
                     ) + 'px',
                  top:
                     getGroupChildrenPosition(
                        child.nodeInfo.y,
                        node.nodeInfo.y,
                     ) + 'px',
               },
            },
            options,
            indent + 1,
         )}`,
   )
   .join('')}
</${node.tag}>`
      }

      return childrenString
   }

   return `<${node.tag} ${getStyleAttrs(node.style, node.styleMeta)}>
${node.textContent ?? ''}
${childrenString}
</${node.tag}>`
}
