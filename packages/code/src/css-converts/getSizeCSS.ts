export const getSizeCSS = (node: Pick<SceneNode, 'width' | 'height'>) => {
   return {
      width: node.width + 'px',
      height: node.height + 'px',
   }
}
