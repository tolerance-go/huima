import { CSSStyle } from "./type";

export function generateFlexLayoutCSS(
  frameNode: Pick<
    FrameNode,
    | "layoutMode"
    | "itemSpacing"
    | "paddingLeft"
    | "paddingTop"
    | "paddingRight"
    | "paddingBottom"
    | "counterAxisAlignItems"
    | "primaryAxisAlignItems"
  >
) {
  if (frameNode.layoutMode !== "NONE") {
    let css: CSSStyle = {
      display: "flex",
      ["flex-direction"]:
        frameNode.layoutMode.toLowerCase() === "horizontal" ? "row" : "column",
      gap: frameNode.itemSpacing ? frameNode.itemSpacing + "px" : undefined,
    };

    // 对每个 padding 属性进行单独的设置
    css["padding-left"] = frameNode.paddingLeft + "px";
    css["padding-top"] = frameNode.paddingTop + "px";
    css["padding-right"] = frameNode.paddingRight + "px";
    css["padding-bottom"] = frameNode.paddingBottom + "px";

    // 设置主轴对齐方式
    switch (frameNode.counterAxisAlignItems) {
      case "MIN":
        css["align-items"] = "flex-start";
        break;
      case "CENTER":
        css["align-items"] = "center";
        break;
      case "MAX":
        css["align-items"] = "flex-end";
        break;
    }

    // 设置次轴对齐方式
    switch (frameNode.primaryAxisAlignItems) {
      case "MIN":
        css["justify-content"] = "flex-start";
        break;
      case "CENTER":
        css["justify-content"] = "center";
        break;
      case "MAX":
        css["justify-content"] = "flex-end";
        break;
    }

    return css;
  }
}
