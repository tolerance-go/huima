import { getFillSolidColor } from "../utils/getFillSolidColor";

export const getBackgroundColorCSS = (fills: symbol | readonly Paint[]) => {
  return {
    "background-color": getFillSolidColor(fills as Paint[]),
  };
};
