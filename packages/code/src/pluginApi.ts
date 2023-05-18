export const pluginApi = (() => {
   try {
      return jsDesign || figma
   } catch {
      return figma
   }
})()

export const isJsDesign = (() => {
   try {
      return !!jsDesign
   } catch {
      return false
   }
})()
