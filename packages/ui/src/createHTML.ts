import { NodeTree } from "@huima/types";
import { removeUndefined } from "@huima/utils";

const createStyle = (node: NodeTree) => {
  // const url = URL.createObjectURL(
  //   new Blob([buffer], { type: "image/png" })
  // );
};

export function createHTML(nodeTree: NodeTree, indent = 0): string {
  if (nodeTree.tag === "dumb") {
    if (indent === 0) {
      return `<div style="position: relative;">
    ${nodeTree.children
      .map((child) => createHTML(child, indent + 1))
      .join("\n")}
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
