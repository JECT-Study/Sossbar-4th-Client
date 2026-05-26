export type Tag = {
  tagId: number;
  name: string;
};

export type ReceivedTagCount = {
  tagId: number;
  tagName: string;
  count: number;
};

export type ReceivedTags = {
  top3Tags: ReceivedTagCount[];
  allTags: ReceivedTagCount[];
};
