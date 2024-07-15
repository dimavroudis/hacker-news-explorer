import { memo } from "react";
import type { SearchResult } from "../../types/api";
import styles from "./styles.module.css";

export interface ListItem extends SearchResult {
  disabled?: boolean;
}

interface ListitemProps {
  item: ListItem;
  selected?: boolean;
  posinset?: number;
  setsize?: number;
  children?: React.ReactNode;
  onClick?: (item: ListItem) => void;
  onMouseEnter?: (e: React.MouseEvent, item: ListItem) => void;
  onMouseMove?: (e: React.MouseEvent, item: ListItem) => void;
  className?: string;
  highlight?: boolean;
}

const Seperator = () => <span className={styles.seperator} />;

const Listitem: React.FC<ListitemProps> = memo(
  ({
    item,
    children,
    onClick,
    onMouseEnter,
    onMouseMove,
    className,
    selected,
    setsize,
    posinset,
    highlight,
  }) => {
    const selectable = !!onClick;

    const handleOnClick = () => {
      if (onClick) {
        onClick(item);
      }
    };

    const handleMouseEnter = (e: React.MouseEvent) => {
      if (onMouseEnter) {
        onMouseEnter(e, item);
      }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
      if (onMouseMove) {
        onMouseMove(e, item);
      }
    };

    const points = !item.points
      ? "No points"
      : item.points === 1
      ? "1 point"
      : `${item.points} points`;
    const author =
      item.author === ""
        ? "No author"
        : ` by ${
            (highlight && item._highlightResult.author?.value) || item.author
          }`;
    const comments = !item.num_comments
      ? "No comments"
      : item.num_comments === 1
      ? "1 comment"
      : `${item.num_comments} comments`;
    const url = item.url || item.story_url;
    const Content = selectable || !url ? "div" : "a";
    const contentProps =
      !selectable && url ? { href: url, target: "_blank" } : {};
    const itemProps = {
      role: selectable ? "option" : "listitem",
      "aria-selected": selected,
      "aria-setsize": setsize,
      "aria-posinset": posinset,
    };

    const titleKey = "title" in item ? "title" : "story_title";
    const title =
      (highlight && item._highlightResult[titleKey]?.value) ||
      item[titleKey] ||
      "";

    const classNames = [styles.container, className]
      .filter(Boolean)
      .join(" ")
      .trim();

    return (
      <div
        {...itemProps}
        className={classNames}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onClick={handleOnClick}
      >
        <Content className={styles.content} {...contentProps}>
          <h3
            className={styles.title}
            dangerouslySetInnerHTML={{ __html: title }}
          />
          <p className={styles.meta}>
            <span>{points}</span>
            <Seperator />
            <span dangerouslySetInnerHTML={{ __html: author }} />
            <Seperator />
            <span>{comments}</span>
          </p>
        </Content>
        {children}
      </div>
    );
  }
);

export default Listitem;
