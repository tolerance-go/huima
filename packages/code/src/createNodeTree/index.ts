import { getPaintColor } from "../getPaintColor";
import { CSSStyle, NodeTree, SceneNodeRuntime } from "../type";
import { createFrameNode } from "./createFrameNode";
import { createRectangleNode } from "./createRectangleNode";

export async function createNodeTree(
  sceneNode: SceneNodeRuntime,
  level = 0
): Promise<NodeTree> {
  console.log("sceneNode", sceneNode, sceneNode.type);

  const getBaseStyle = () => {
    const parentNode = sceneNode.parent;

    if (
      parentNode &&
      "layoutMode" in parentNode &&
      parentNode.layoutMode !== "NONE"
    ) {
      return {
        position: "relative",
      };
    }
    return {
      position: level === 0 ? "relative" : "absolute",
      left: level === 0 ? undefined : sceneNode.x + "px",
      top: level === 0 ? undefined : sceneNode.y + "px",
    };
  };

  const children: NodeTree[] =
    "children" in sceneNode
      ? await Promise.all(
          sceneNode.children.map((item) => createNodeTree(item, level + 1))
        )
      : [];

  let tag: string = "";
  let baseStyle: CSSStyle = getBaseStyle();
  let textContent: string | undefined;

  if (sceneNode.type === "FRAME") {
    return await createFrameNode(sceneNode, baseStyle, children);
  } else if (sceneNode.type === "GROUP") {
    tag = "dumb";
  } else if (sceneNode.type === "TEXT") {
    tag = "span";
    textContent = sceneNode.characters;
    const textNode = sceneNode;
    const color = getPaintColor(textNode.fills);

    baseStyle = {
      ...baseStyle,
      "font-size": (sceneNode.fontSize as number) + "px",
      color,
    };
  } else if (sceneNode.type === "RECTANGLE") {
    return createRectangleNode(sceneNode, baseStyle, children);
  } else if (sceneNode.type === "ELLIPSE" || sceneNode.type === "VECTOR") {
    tag = "div";

    const shapeNode = sceneNode;
    let backgroundColor = getPaintColor(shapeNode.fills);

    baseStyle = {
      ...baseStyle,
      width: shapeNode.width + "px",
      height: shapeNode.height + "px",
      "border-radius": (shapeNode.cornerRadius as number) + "px",
      "background-color": backgroundColor,
    };
  }

  return {
    tag,
    style: baseStyle,
    children,
    textContent,
  };
}
