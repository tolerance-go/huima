/**
 * 在 Figma 中，当你设置一个元素的宽度和高度时，这些值包含了元素的内容、内边距和边框。
 * 这与 CSS 的 border-box 模型相符，它将元素的宽度和高度定义为内容、内边距和边框的总和。
 */
export const getBoxSizing = () => {
   return {
      'box-sizing': 'border-box',
   }
}
