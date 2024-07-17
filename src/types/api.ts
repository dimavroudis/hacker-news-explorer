export interface BaseStory extends Record<string, unknown> {
  author: string;
  objectID: string;
  created_at: string;
  created_at_i: number;
  updated_at: string;
  story_id: number;
  children: number[];
}

export interface StoryHighlightResult {
  author: HighlightResult;
  title: HighlightResult;
  url: HighlightResult;
  story_title: undefined;
  story_url: undefined;
}

export interface CommentHighlightResult {
  author: HighlightResult;
  story_title: HighlightResult;
  story_url: HighlightResult;
  title: undefined;
  url: undefined;
}

export interface HighlightResult {
  fullyHighlighted?: boolean;
  matchLevel: string;
  matchedWords: string[];
  value: string;
}

export interface Story extends BaseStory {
  title: string;
  url: string;
  num_comments: number;
  points: number;
  _highlightResult: StoryHighlightResult;
  comment_text: undefined;
  story_title: undefined;
  story_url: undefined;
  parent_id: undefined;
  _tags: undefined;
}

export interface Comment extends BaseStory {
  comment_text: string;
  story_title: string;
  story_url: string;
  parent_id: number;
  points: null;
  _tags: string[];
  _highlightResult: CommentHighlightResult;
  title: undefined;
  url: undefined;
  num_comments: undefined;
}

export type SearchResult = Story | Comment;

export interface SearchResults {
  hits: SearchResult[];
  nbHits: number;
  page: number;
  nbPages: number;
  hitsPerPage: number;
  processingTimeMS: number;
  query: string;
  params: string;
  exhaustiveNbHits: boolean;
  renderState: boolean;
}
