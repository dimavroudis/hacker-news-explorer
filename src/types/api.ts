export interface SearchResult {
  _highlightResult: {
    author: HighlightResult;
    title?: HighlightResult;
    url?: HighlightResult;
    story_title?: HighlightResult;
    story_url?: HighlightResult;
  };
  _tags?: string[];
  author: string;
  objectID: string;
  parent_id?: number;
  children?: number[];
  created_at: string;
  created_at_i: number;
  updated_at: string;
  num_comments?: number;
  comment_text?: string;
  points: number | null;
  story_id: number;
  title?: string;
  story_title?: string;
  url?: string;
  story_url?: string;
}

export interface HighlightResult {
  fullyHighlighted?: boolean;
  matchLevel: string;
  matchedWords: string[];
  value: string;
}

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
