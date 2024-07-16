import React, { memo, useCallback, useEffect, useMemo } from "react";
import Listitem from "./listitem";
import debounceLeading from "../../utils/debounceLeading";
import styles from "./styles.module.css";

interface ListboxProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string;
  className?: string;
  children?: React.ReactNode;
  onSelectItem?: (e: React.MouseEvent | { target: Element }) => void;
  onUpdateActiveDescendant?: (index: number) => void;
}

const Listbox: React.FC<ListboxProps> = memo(
  ({
    children,
    className,
    onSelectItem,
    onUpdateActiveDescendant,
    ...props
  }) => {
    const listboxRef = React.useRef<HTMLDivElement>(null);
    const [activeIndex, _setActiveIndex] = React.useState(0);
    const mousePosition = React.useRef({ x: 0, y: 0 });

    const setActiveIndex = useCallback(
      (index: number) => {
        _setActiveIndex(index);
        if (onUpdateActiveDescendant) {
          onUpdateActiveDescendant(index);
        }
      },
      [_setActiveIndex, onUpdateActiveDescendant]
    );

    const handleMouseEnter = useCallback(
      (e: React.MouseEvent) => {
        if (!e.target || !(e.target instanceof HTMLElement)) {
          return;
        }

        // do not update active index if the mouse is not moving
        if (
          e.clientX === mousePosition.current.x &&
          e.clientY === mousePosition.current.y
        ) {
          return;
        }

        mousePosition.current = { x: e.clientX, y: e.clientY };

        const option = e.target.closest("[role='option']");
        if (!option || !option.hasAttribute("aria-posinset")) {
          setActiveIndex(-1);
          return;
        }
        const index =
          parseInt(option.getAttribute("aria-posinset") || "0", 10) - 1;
        setActiveIndex(index);
      },
      [setActiveIndex]
    );

    const items = useMemo(
      () =>
        React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) {
            return null;
          }
          return (
            <Listitem
              key={index}
              {...child.props}
              posinset={index + 1}
              setsize={React.Children.count(children)}
              selected={index === activeIndex}
              onClick={onSelectItem}
              onMouseEnter={debounceLeading(handleMouseEnter)}
              onMouseMove={debounceLeading(handleMouseEnter)}
            />
          );
        }),
      [handleMouseEnter, onSelectItem, activeIndex, children]
    );

    const scrollToItem = useCallback(
      (index: number) => {
        if (!items || items.length === 0) {
          return;
        }
        if (!listboxRef.current) {
          return;
        }

        const activeItem = listboxRef.current?.querySelector(
          "[aria-posinset='" + (index + 1) + "']"
        );
        if (!activeItem) {
          return;
        }

        const scrollContainer = listboxRef.current.parentNode as HTMLElement;

        const listboxRect = scrollContainer.getBoundingClientRect();
        const activeItemRect = activeItem.getBoundingClientRect();
        if (activeItemRect.top < listboxRect.top) {
          scrollContainer.scrollTop -= listboxRect.top - activeItemRect.top;
        } else if (activeItemRect.bottom > listboxRect.bottom) {
          scrollContainer.scrollTop +=
            activeItemRect.bottom - listboxRect.bottom;
        }
      },
      [items]
    );

    const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
        if (!items || items.length === 0) {
          return;
        }
        if (e.key === "ArrowDown") {
          const newIndex = Math.min(activeIndex + 1, items.length - 1);
          scrollToItem(newIndex);
          setActiveIndex(newIndex);
        }
        if (e.key === "ArrowUp") {
          const newIndex = Math.max(activeIndex - 1, 0);
          scrollToItem(newIndex);
          setActiveIndex(newIndex);
        }
        if (e.key === "Home") {
          scrollToItem(0);
          setActiveIndex(0);
        }
        if (e.key === "End") {
          scrollToItem(items.length - 1);
          setActiveIndex(items.length - 1);
        }
        if (e.key === "Enter" && listboxRef.current) {
          const item = listboxRef.current.querySelector(
            `[aria-posinset="${activeIndex + 1}"]`
          );
          if (onSelectItem && item) {
            const newEvent = { target: item };
            onSelectItem(newEvent);
          }
        }
      },
      [items, activeIndex, scrollToItem, onSelectItem]
    );

    useEffect(() => {
      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [handleKeyDown]);

    const classNames = [styles.container, className]
      .filter(Boolean)
      .join(" ")
      .trim();

    return (
      <div role="listbox" {...props} className={classNames} ref={listboxRef}>
        {items}
      </div>
    );
  }
);

export default Listbox;
