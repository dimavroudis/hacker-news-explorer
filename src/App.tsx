import { useCallback, useMemo } from "react";
import type { SearchResult, SearchResults } from "./types/api";
import useStorage from "./hooks/useStorage";
import Button from "./components/button";
import StoryDisplay from "./components/story";
import AutoSuggest from "./components/autosuggest";

import "./App.css";

const HACKER_NEWS_API = "https://hn.algolia.com/api/v1/search?query=";
const STORAGE_KEY = "hacker_news_stories";

const HighlihgtedStory = ({
  item: { title, story_title, author, points, num_comments, _highlightResult },
}: {
  item: SearchResult;
}) => (
  <StoryDisplay
    title={(title || story_title) as string}
    author={author}
    points={points}
    num_comments={num_comments}
    highlightResults={_highlightResult}
  />
);

function App() {
  const [items, setItems] = useStorage<SearchResult[]>(STORAGE_KEY, []);

  const handleSearch = useCallback(async (value: string) => {
    const res = await fetch(`${HACKER_NEWS_API}${value}`);
    const data = (await res.json()) as SearchResults;
    return data.hits;
  }, []);

  const handleSelect = useCallback(
    (item: SearchResult) => {
      setItems([...items, item]);
    },
    [items, setItems]
  );

  const handleDelete = useCallback(
    (item: SearchResult) => {
      const newItems = items.filter(
        (prevItem) => prevItem.objectID !== item.objectID
      );
      setItems(newItems);
    },
    [items, setItems]
  );

  const excludeItems = useMemo(
    () => items.map((item) => item.objectID),
    [items]
  );

  return (
    <div className="container">
      <div className="header">
        <AutoSuggest
          Item={HighlihgtedStory}
          itemIdKey="objectID"
          label="Search"
          listboxLabel="Search results"
          placeholder="Search title"
          searchCallback={handleSearch}
          onSelect={handleSelect}
          excludeItems={excludeItems}
        />
      </div>
      <h2>Saved Stories</h2>
      <div className="content">
        {items.length === 0 ? (
          <p>No saved stories</p>
        ) : (
          <>
            <div role="list" className="saved-stories">
              {items.map((item) => (
                <div role="listitem" key={item.objectID}>
                  <StoryDisplay
                    title={(item.title || item.story_title) as string}
                    url={(item.url || item.story_url) as string}
                    author={item.author}
                    points={item.points}
                    num_comments={item.num_comments}
                  />
                  <Button onClick={() => handleDelete(item)}>Delete</Button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
