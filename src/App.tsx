import { useCallback, useMemo } from "react";
import type { SearchResult, SearchResults } from "./types/api";
import AutoSuggest from "./components/autosuggest";
import Listitem, { ListItem } from "./components/listitem";

import "./App.css";
import Button from "./components/button";
import useSession from "./hooks/useSession";

const HACKER_NEWS_API = "https://hn.algolia.com/api/v1/search?query=";

function App() {
  const [items, setItems] = useSession<SearchResult[]>("data", []);

  const handleSearch = useCallback(async (value: string) => {
    const res = await fetch(`${HACKER_NEWS_API}${value}`);
    const data = (await res.json()) as SearchResults;
    return data.hits;
  }, []);

  const handleSelect = useCallback(
    (item: ListItem) => {
      setItems([...items, item]);
    },
    [items, setItems]
  );

  const handleDelete = useCallback(
    (item: ListItem) => {
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
            <div className="saved-stories">
              {items.map((item) => (
                <Listitem key={item.objectID} item={item}>
                  <Button onClick={() => handleDelete(item)}>Delete</Button>
                </Listitem>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
