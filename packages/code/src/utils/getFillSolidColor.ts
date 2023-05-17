export const getFillSolidColor = (fills: Paint[]) => {
  let color = undefined; // 默认背景色
  if (Array.isArray(fills)) {
    const solidFill = fills
      .filter((item) => item.visible)
      .find((fill) => fill.type === "SOLID") as SolidPaint;
    if (solidFill) {
      const rgb = solidFill.color;
      const rgbaColor = `rgba(${rgb.r * 255}, ${rgb.g * 255}, ${rgb.b * 255}, ${
        solidFill.opacity
      })`;
      color = rgbaColor;
    }
  }
  return color;
};
