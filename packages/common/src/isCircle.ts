// 函数：检查 arcData 是否表示一个完整的圆
export function isCircle(arcData: ArcData) {
   const tolerance = 0.00001 // 用于处理浮点数运算的误差
   const diff = arcData.endingAngle - arcData.startingAngle
   const remainder = diff % (2 * Math.PI)

   // 检查余数是否接近于0（表示完整的圆）或者接近于2π（也表示完整的圆）
   // 同时，innerRadius 必须为 0
   return (
      (Math.abs(remainder) < tolerance ||
         Math.abs(remainder - 2 * Math.PI) < tolerance) &&
      arcData.innerRadius === 0
   )
}
