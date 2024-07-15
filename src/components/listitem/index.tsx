import { memo } from "react";
import { SearchResult } from "../../types/api";
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
  className?: string;
  highlight?: boolean;
}

const Seperator = () => <span className={styles.seperator} />;

const Listitem: React.FC<ListitemProps> = memo(
  ({
    item,
    children,
    onClick,
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
      // tabIndex: selectable ? -1 : undefined,
      onClick: selectable ? handleOnClick : undefined,
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
      <div {...itemProps} className={classNames}>
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
