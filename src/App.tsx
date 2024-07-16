import { useCallback, useMemo } from "react";
import type { SearchResult, SearchResults } from "./types/api";
import AutoSuggest from "./components/autosuggest";

import "./App.css";
import Button from "./components/button";
import useStorage from "./hooks/useStorage";
import Story from "./components/story";

const HACKER_NEWS_API = "https://hn.algolia.com/api/v1/search?query=";
const STORAGE_KEY = "hacker_news_stories";

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
          label="Search"
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
            <div role="listbox" className="saved-stories">
              {items.map((item) => (
                <div role="listitem" key={item.objectID}>
                  <Story item={item} />
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
