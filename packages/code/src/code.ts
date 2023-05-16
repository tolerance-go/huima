import { Events } from "@huima/types";
import { createNodeTree } from "./createNodeTree";
import { SceneNodeRuntime } from "./type";

//====================== 工具函数 * 开始 ======================

const postActionToUI = <T extends keyof Events>(
  type: T,
  payload: Events[T]
) => {
  figma.ui.postMessage({
    type,
    payload,
  });
};

//====================== 工具函数 * 结束 ======================

//====================== UI 事件处理 * 开始 ======================
figma.ui.onmessage = async (message) => {
  if (message.type === "genCode") {
    if (figma.currentPage.selection.length === 1) {
      const [node] = figma.currentPage.selection;

      const nodeTree = await createNodeTree(node as SceneNodeRuntime);

      postActionToUI("startGen", {
        name: node.name,
        id: node.id,
        nodeTree,
      });
    }
  }
};

figma.on("selectionchange", () => {
  if (figma.currentPage.selection.length === 1) {
    const [node] = figma.currentPage.selection;

    postActionToUI("selectionchange", {
      name: node.name,
      id: node.id,
    });
  }
});

//====================== UI 事件处理 * 结束 ======================

figma.showUI(__html__, {
  height: 600,
  width: 800,
});
