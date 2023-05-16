import "./global";

export type CSSStyle = Record<string, string | number | undefined>;

export type NodeInfo = Pick<SceneNode, "type" | "x" | "y"> &
  Record<string, string | number>;

export interface NodeTree {
  tag: string;
  style: CSSStyle;
  children: NodeTree[];
  textContent?: string;
  nodeInfo: NodeInfo;
}

export type UIEvents = {
  selectionchange: {
    name: string;
    id: string;
  };
  startGen: {
    name: string;
    id: string;
    nodeTree: NodeTree;
  };
};

export type UIAction<K extends keyof UIEvents> = {
  type: K;
  payload: UIEvents[K];
};
