import { useEffect, useId, useRef, useState } from "react";
import Dropdown from "../dropdown";
import Listbox, { Listitem } from "../listbox";
import styles from "./styles.module.css";

interface AutoSuggestProps<S extends Record<string, unknown>> {
  label: string;
  searchCallback: (value: string) => Promise<S[]>;
  Item: React.ElementType;
  itemIdKey: string;
  listboxLabel?: string;
  placeholder?: string;
  minChars?: number;
  clearOnSelect?: boolean;
  closeOnSelect?: boolean;
  onChange?: (value: string) => void;
  onSelect?: (item: S) => void;
  excludeItems?: string[];
}

const AutoSuggest = <S extends Record<string, unknown>>({
  label,
  placeholder,
  Item,
  itemIdKey,
  listboxLabel,
  minChars = 3,
  onChange,
  onSelect,
  searchCallback,
  excludeItems = [],
}: AutoSuggestProps<S>) => {
  const id = useId();
  const [suggestions, setSuggestions] = useState<S[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const hasSuggestions = suggestions.length > 0;
  const isDropdownOpen = isFocused && hasSuggestions;

  const maybeSetSuggestions = (value: string, results: S[]) => {
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

  const handleSelect = (e: React.MouseEvent | { target: Element }) => {
    if (!e.target || !(e.target instanceof HTMLElement)) {
      return;
    }

    const option = e.target.closest("[role='option']");
    if (!option || !option.hasAttribute("aria-posinset")) {
      return;
    }

    const index = parseInt(option.getAttribute("aria-posinset") || "0", 10) - 1;
    const item = suggestions[index];

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

  const handleActiveDescedantUpdate = (index: number) => {
    setActiveIndex(index);
  };

  useEffect(() => {
    const hasExcludedItems =
      excludeItems.length &&
      suggestions.some((suggestion) =>
        excludeItems.includes(suggestion[itemIdKey] as string)
      );

    if (hasExcludedItems) {
      const filteredSuggestions = suggestions.filter(
        (suggestion) => !excludeItems.includes(suggestion[itemIdKey] as string)
      );
      setSuggestions(filteredSuggestions);
      return;
    }
  }, [excludeItems, itemIdKey, suggestions]);

  const getListItemId = (itemId: string) => {
    return `autosuggest-listitem-${id}-${itemId}`;
  };

  const inputId = `autosuggest-${id}`;
  const listboxId = `autosuggest-listbox-${id}`;

  const ariaControls = isDropdownOpen ? listboxId : undefined;
  const ariaActiveDescendant = isDropdownOpen
    ? getListItemId(suggestions[activeIndex][itemIdKey] as string)
    : undefined;

  return (
    <>
      <div className={styles.control}>
        <label htmlFor={inputId}>{label}</label>
        <input
          id={inputId}
          type="text"
          spellCheck="false"
          autoComplete="off"
          role="combobox"
          aria-expanded={isDropdownOpen}
          aria-controls={ariaControls}
          aria-activedescendant={ariaActiveDescendant}
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
        <Listbox
          id={listboxId}
          onSelectItem={handleSelect}
          onUpdateActiveDescendant={handleActiveDescedantUpdate}
          aria-label={listboxLabel}
        >
          {suggestions.map((item) => (
            <Listitem
              key={item[itemIdKey] as string}
              className={styles.listitem}
              id={getListItemId(item[itemIdKey] as string)}
            >
              <Item item={item} />
            </Listitem>
          ))}
        </Listbox>
      </Dropdown>
    </>
  );
};

export default AutoSuggest;
