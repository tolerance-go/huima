import { CSSStyle, NodeTree } from '@huima/types'
import { removeUndefined } from '@huima/utils'
import { getGroupChildrenPosition } from './getGroupChildrenPosition'

const getStyleString = (style: CSSStyle) => {
   const styleString = Object.entries(removeUndefined(style))
      .map(([key, value]) => `${key}: ${value};`)
      .join(' ')
   return styleString
}

export function createHTML(node: NodeTree, indent = 0): string {
   console.log('createHTML', node)

   if (node.nodeInfo.visible === false) return ''

   if (node.element) {
      return node.element.replace(
         `<${node.tag}`,
         `<${node.tag} style="${getStyleString(node.style)}"`,
      )
   }

   const childrenString = node.children
      .map((child) => `\n${createHTML(child, indent + 1)}`)
      .join('')

   if (node.nodeInfo.type === 'GROUP') {
      //NOTE - Group 第一层子元素坐标位置需要进行偏移计算
      //NOTE - 如果 Group 在一个 auto layout 节点内，那么当做一个 div 进行渲染
      if (
         indent === 0 ||
         (node.nodeInfo.parentNodeInfo &&
            'layoutMode' in node.nodeInfo.parentNodeInfo &&
            node.nodeInfo.parentNodeInfo.layoutMode !== 'NONE')
      ) {
         return `<${node.tag} style="${getStyleString(node.style)}">
    ${node.children
       .map(
          (child) =>
             `\n${createHTML(
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
                indent + 1,
             )}`,
       )
       .join('')}
  </${node.tag}>`
      }

      return childrenString
   }

   return `<${node.tag} style="${getStyleString(node.style)}">
${node.textContent ?? ''}
${childrenString}
</${node.tag}>\n`
}

// const createStyle = (node: NodeTree) => {
//   // console.log('createStyle', node)
//   // let style: CSSStyle = {};
//   // for (const key in node.style) {
//   //   if (
//   //     key === "background-image" &&
//   //     node.style[key] &&
//   //     node.styleMeta?.backgroundImageBuffer
//   //   ) {
//   //     const url = URL.createObjectURL(
//   //       new Blob([node.styleMeta.backgroundImageBuffer])
//   //     );

//   //     style[key] = String(node.style[key]).replace("$url", url);
//   //     continue;
//   //   }
//   //   style[key] = node.style[key];
//   // }

//   return node.style;
// };
