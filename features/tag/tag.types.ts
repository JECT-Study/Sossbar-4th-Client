/** 후기 작성 폼에서 선택 가능한 태그 */
export interface Tag {
  tagId: number;
  name: string;
}

export interface ReceivedTagCount {
  tagId: number;
  tagName: string;
  count: number;
}

export interface ReceivedTags {
  top3Tags: ReceivedTagCount[];
  allTags: ReceivedTagCount[];
}
