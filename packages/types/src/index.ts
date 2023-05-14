import "./global";

export type Events = {
  selectionchange: {
    name: string;
    id: string;
  };
  startGen: {
    name: string;
    id: string;
    html: string;
  };
};

export type Action<K extends keyof Events> = {
  type: K;
  payload: Events[K];
};
