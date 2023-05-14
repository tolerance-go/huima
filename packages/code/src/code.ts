import { Events } from "@huima/types";

interface NodeTree {
  tag: string;
  style: any; // 使用适合你的样式信息的类型
  children: NodeTree[];
  textContent?: string;
}

interface FrameNode {
  layoutMode: string;
  itemSpacing?: string;
  paddingLeft?: number;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  primaryAxisAlignItems?: string;
  alignItems?: "flex-start" | "center" | "flex-end";
  counterAxisAlignItems?: string;
  justifyContent?: string;
  strokes?: {
    type: string;
    color: {
      r: number;
      g: number;
      b: number;
    };
    opacity: number;
  }[];
  strokeWeight?: number;
  strokeStyleId?: string;
}

type CSSStyle = Record<string, string | number | undefined | symbol>;

const getFillColor = (fills: symbol | readonly Paint[]) => {
  let backgroundColor = undefined; // 默认背景色
  if (Array.isArray(fills)) {
    const solidFill = fills.find((fill) => fill.type === "SOLID") as SolidPaint;
    if (solidFill) {
      const rgb = solidFill.color;
      const rgbaColor = `rgba(${rgb.r * 255}, ${rgb.g * 255}, ${rgb.b * 255}, ${
        solidFill.opacity
      })`;
      backgroundColor = rgbaColor;
    }
  }
  return backgroundColor;
};

function removeUndefined<T extends Object>(obj: T): T {
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && obj[key] === undefined) {
      delete obj[key];
    }
  }
  return obj;
}

const isDefine = <T>(item: T) => {
  return item !== undefined && item !== null;
};

function frameNodeToFlexCSS(frameNode: FrameNode) {
  if (frameNode.layoutMode && frameNode.layoutMode !== "NONE") {
    let css: CSSStyle = {
      display: "flex",
      ["flex-direction"]:
        frameNode.layoutMode.toLowerCase() === "horizontal" ? "row" : "column",
      gap: frameNode.itemSpacing ? frameNode.itemSpacing + "px" : "0px",
    };

    // 对每个 padding 属性进行单独的设置
    if (isDefine(frameNode.paddingLeft)) {
      css["padding-left"] = frameNode.paddingLeft + "px";
    }
    if (isDefine(frameNode.paddingTop)) {
      css["padding-top"] = frameNode.paddingTop + "px";
    }
    if (isDefine(frameNode.paddingRight)) {
      css["padding-right"] = frameNode.paddingRight + "px";
    }
    if (isDefine(frameNode.paddingBottom)) {
      css["padding-bottom"] = frameNode.paddingBottom + "px";
    }

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

function convertFigmaNodeToBorderCSS(node: FrameNode): CSSStyle {
  let cssProps: CSSStyle = {};

  if (node.strokes && node.strokes.length > 0) {
    const stroke = node.strokes[0];
    if (stroke.type === "SOLID") {
      cssProps["border-color"] = stroke.color
        ? `rgba(${Math.round(stroke.color.r * 255)}, ${Math.round(
            stroke.color.g * 255
          )}, ${Math.round(stroke.color.b * 255)}, ${stroke.opacity})`
        : "";
    }
    cssProps["border-width"] = node.strokeWeight
      ? `${node.strokeWeight}px`
      : "";
  }

  if (node.strokeStyleId) {
    switch (node.strokeStyleId) {
      case "SOLID":
        cssProps["border-style"] = "solid";
        break;
      case "DASHED":
        cssProps["border-style"] = "dashed";
        break;
      case "DOTTED":
        cssProps["border-style"] = "dotted";
        break;
      default:
        cssProps["border-style"] = "solid";
        break;
    }
  }

  return cssProps;
}

function createNodeTree(figmaNode: SceneNode, level = 0): NodeTree {
  console.log("figmaNode", figmaNode, figmaNode.type);
  const parentNode = figmaNode.parent;

  const getBaseStyle = () => {
    if (
      (parentNode as unknown as FrameNode | null)?.layoutMode &&
      (parentNode as unknown as FrameNode | null)?.layoutMode !== "NONE"
    ) {
      return {
        position: "relative",
      };
    }
    return {
      position: level === 0 ? "relative" : "absolute",
      left: level === 0 ? undefined : figmaNode.x + "px",
      top: level === 0 ? undefined : figmaNode.y + "px",
    };
  };

  let tag: string = "";
  let style: CSSStyle = getBaseStyle();
  let textContent: string | undefined;

  if (figmaNode.type === "FRAME") {
    tag = "div";
    const shapeNode = figmaNode;
    let backgroundColor = getFillColor(shapeNode.backgrounds);

    style = {
      ...style,
      width: figmaNode.width + "px",
      height: figmaNode.height + "px",
      "background-color": backgroundColor,
      ...frameNodeToFlexCSS(figmaNode as unknown as FrameNode),
      ...convertFigmaNodeToBorderCSS(figmaNode as unknown as FrameNode),
    };
  } else if (figmaNode.type === "GROUP") {
    tag = "dumb";
  } else if (figmaNode.type === "TEXT") {
    tag = "span";
    textContent = figmaNode.characters;
    const textNode = figmaNode;
    const color = getFillColor(textNode.fills);

    style = {
      ...style,
      "font-size": figmaNode.fontSize,
      color,
    };
  } else if (
    figmaNode.type === "RECTANGLE" ||
    figmaNode.type === "ELLIPSE" ||
    figmaNode.type === "VECTOR"
  ) {
    tag = "div";

    const shapeNode = figmaNode;
    let backgroundColor = getFillColor(shapeNode.fills);

    // 提取 RectangleNode 或 EllipseNode 的样式信息
    style = {
      ...style,
      width: shapeNode.width + "px",
      height: shapeNode.height + "px",
      "border-radius": (shapeNode.cornerRadius as number) + "px",
      "background-color": backgroundColor,
    };
  }

  const children: NodeTree[] =
    "children" in figmaNode
      ? figmaNode.children.map((item) => createNodeTree(item, level + 1))
      : [];
  return {
    tag,
    style,
    children,
    textContent,
  };
}

function createHTML(nodeTree: NodeTree, indent = 0): string {
  if (nodeTree.tag === "dumb") {
    if (indent === 0) {
      return `<div style="position: relative;">
  ${nodeTree.children.map((child) => createHTML(child, indent + 1)).join("\n")}
</div>`;
    }

    return nodeTree.children
      .map((child) => createHTML(child, indent + 1))
      .join("\n");
  }

  const indentSpace = "  ".repeat(indent);
  const styleString = Object.entries(removeUndefined(nodeTree.style))
    .map(([key, value]) => `${key}: ${value};`)
    .join(" ");
  const startTag = `${indentSpace}<${nodeTree.tag} style="${styleString}">`;
  const endTag = `</${nodeTree.tag}>\n`;
  const textContent = nodeTree.textContent ? `${nodeTree.textContent}` : "";
  const childrenString = nodeTree.children
    .map((child) => `\n${createHTML(child, indent + 1)}`)
    .join("");
  return (
    startTag +
    textContent +
    childrenString +
    (nodeTree.children.length > 0 ? `\n${indentSpace}` : "") +
    endTag
  );
}

//====================== 工具函数 * 开始 ======================

const postAction = <T extends keyof Events>(type: T, payload: Events[T]) => {
  figma.ui.postMessage({
    type,
    payload,
  });
};

//====================== 工具函数 * 结束 ======================

//====================== UI 事件处理 * 开始 ======================
figma.ui.onmessage = (message) => {
  if (message.type === "genCode") {
    if (figma.currentPage.selection.length === 1) {
      const [node] = figma.currentPage.selection;

      postAction("startGen", {
        name: node.name,
        id: node.id,
        html: createHTML(createNodeTree(node)),
      });
    }
  }
};

figma.on("selectionchange", () => {
  if (figma.currentPage.selection.length === 1) {
    const [node] = figma.currentPage.selection;

    postAction("selectionchange", {
      name: node.name,
      id: node.id,
    });
  }
});

//====================== UI 事件处理 * 结束 ======================

figma.showUI(__html__, {
  height: 660,
});
