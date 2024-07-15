import { useEffect, useId, useRef, useState } from "react";
import Dropdown from "../dropdown";
import Listbox from "../listbox";
import Listitem, { ListItem } from "../listitem";
import styles from "./styles.module.css";

interface AutoSuggestProps {
  label: string;
  searchCallback: (value: string) => Promise<ListItem[]>;
  placeholder?: string;
  minChars?: number;
  clearOnSelect?: boolean;
  closeOnSelect?: boolean;
  onChange?: (value: string) => void;
  onSelect?: (item: ListItem) => void;
  excludeItems?: string[];
}

const AutoSuggest: React.FC<AutoSuggestProps> = ({
  label,
  placeholder,
  minChars = 3,
  onChange,
  onSelect,
  searchCallback,
  excludeItems = [],
}) => {
  const id = useId();
  const [suggestions, setSuggestions] = useState<ListItem[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const hasSuggestions = suggestions.length > 0;
  const isDropdownOpen = isFocused && hasSuggestions;

  const maybeSetSuggestions = (value: string, results: ListItem[]) => {
    if (!inputRef.current) {
      return;
    }
    if (inputRef.current.value === value) {
      setSuggestions(results);
    }
    if (inputRef.current.value.length < minChars) {
      setSuggestions([]);
      return;
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (onChange) {
      onChange(value);
    }
    if (value.length < minChars) {
      if (hasSuggestions) {
        setSuggestions([]);
      }
      return;
    }
    setIsFocused(true);
    const results = await searchCallback(value);
    maybeSetSuggestions(value, results);
  };

  const handleSelect = (item: ListItem) => {
    if (onSelect) {
      onSelect(item);
    }
  };

  const handleFocus = async () => {
    setIsFocused(true);
  };

  const handleClose = (e: MouseEvent | KeyboardEvent) => {
    if (!inputRef.current) {
      return;
    }
    if (
      e instanceof MouseEvent &&
      inputRef.current.contains(e.target as Node)
    ) {
      return;
    }
    setIsFocused(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape" && inputRef.current && !isDropdownOpen) {
      inputRef.current.value = "";
    }
    if (e.key === "Enter" && hasSuggestions && !isFocused) {
      setIsFocused(true);
    }
  };

  const handleClick: React.MouseEventHandler<HTMLInputElement> = () => {
    setIsFocused(true);
  };

  useEffect(() => {
    const hasExcludedItems =
      excludeItems.length &&
      suggestions.some((suggestion) =>
        excludeItems.includes(suggestion.objectID)
      );

    if (hasExcludedItems) {
      const filteredSuggestions = suggestions.filter(
        (suggestion) => !excludeItems.includes(suggestion.objectID)
      );
      setSuggestions(filteredSuggestions);
      return;
    }
  }, [excludeItems, suggestions]);

  const inputId = `autosuggest-${id}`;

  return (
    <>
      <div className={styles.control}>
        <label htmlFor={inputId}>{label}</label>
        <input
          id={inputId}
          role="combobox"
          type="text"
          spellCheck="false"
          aria-expanded={isDropdownOpen}
          placeholder={placeholder}
          onChange={handleChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          onClick={handleClick}
          ref={inputRef}
        />
      </div>
      <Dropdown
        target={inputRef.current}
        open={isDropdownOpen}
        onClose={handleClose}
        ref={dropdownRef}
      >
        <Listbox onSelect={handleSelect}>
          {suggestions.map((item) => (
            <Listitem
              key={item.objectID}
              item={item}
              highlight
              className={styles.listitem}
            />
          ))}
        </Listbox>
      </Dropdown>
    </>
  );
};

export default AutoSuggest;
