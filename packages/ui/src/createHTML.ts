import { NodeTree } from "@huima/types";
import { removeUndefined } from "@huima/utils";
import { getGroupChildrenPosition } from "./getGroupChildrenPosition";

const createStyle = (node: NodeTree) => {
  // console.log('createStyle', node)
  // let style: CSSStyle = {};
  // for (const key in node.style) {
  //   if (
  //     key === "background-image" &&
  //     node.style[key] &&
  //     node.styleMeta?.backgroundImageBuffer
  //   ) {
  //     const url = URL.createObjectURL(
  //       new Blob([node.styleMeta.backgroundImageBuffer])
  //     );

  //     style[key] = String(node.style[key]).replace("$url", url);
  //     continue;
  //   }
  //   style[key] = node.style[key];
  // }

  return node.style;
};

const getStyleString = (node: NodeTree) => {
  const styleString = Object.entries(removeUndefined(createStyle(node)))
    .map(([key, value]) => `${key}: ${value};`)
    .join(" ");
  return styleString;
};

export function createHTML(node: NodeTree, indent = 0): string {
  console.log("createHTML", node);

  const childrenString = node.children
    .map((child) => `\n${createHTML(child, indent + 1)}`)
    .join("");

  if (node.nodeInfo.type === "GROUP") {
    if (indent === 0) {
      return `<${node.tag} style="${getStyleString(node)}">
    ${node.children
      .map(
        (child) =>
          `\n${createHTML(
            {
              ...child,
              style: {
                ...child.style,
                left:
                  getGroupChildrenPosition(child.nodeInfo.x, node.nodeInfo.x) +
                  "px",
                top:
                  getGroupChildrenPosition(child.nodeInfo.y, node.nodeInfo.y) +
                  "px",
              },
            },
            indent + 1
          )}`
      )
      .join("")}
  </${node.tag}>`;
    }

    return childrenString;
  }

  const indentSpace = "  ".repeat(indent);

  const startTag = `${indentSpace}<${node.tag} style="${getStyleString(
    node
  )}">`;
  const endTag = `</${node.tag}>\n`;
  const textContent = node.textContent ? `${node.textContent}` : "";

  return (
    startTag +
    textContent +
    childrenString +
    (node.children.length > 0 ? `\n${indentSpace}` : "") +
    endTag
  );
}
