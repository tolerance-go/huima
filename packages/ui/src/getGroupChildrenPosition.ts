// https://www.yuque.com/bzone/dsoch6/psng1ou8y2x7vgzi
export const getGroupChildrenPosition = (n: number, pn: number) => {
   if (n === 0 && pn === 0) {
      return 0
   }

   if (pn < n) {
      if (pn < 0 && n > 0) {
         return n - pn
      }

      if (pn === 0 && n > 0) {
         return n
      }

      if (n === 0 && pn <= 0) {
         return -pn
      }

      if (pn > 0 && n > 0) {
         return n - pn
      }

      if (pn < 0 && n < 0) {
         return Math.abs(pn - n)
      }
   }

   // 子元素不会溢出 group 父元素，下面的判断其实可以省略
   if (n < 0 && pn > 0) {
      return pn - n
   }

   if (n === 0 && pn > 0) {
      return -pn
   }

   if (pn === 0 && n < 0) {
      return -n
   }

   if (pn > 0 && n > 0) {
      return pn - n
   }

   if (pn < 0 && n < 0) {
      return Math.abs(n - pn)
   }
}
