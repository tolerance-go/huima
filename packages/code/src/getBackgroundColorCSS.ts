import { getFillSolidColor } from "./getFillSolidColor";

export const getBackgroundColorCSS = (fills: symbol | readonly Paint[]) => {
  return {
    "background-color": getFillSolidColor(fills),
  };
};
