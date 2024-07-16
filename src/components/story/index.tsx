import { memo } from "react";
import type { SearchResult } from "../../types/api";
import styles from "./styles.module.css";

interface ListitemProps {
  item: SearchResult;
  className?: string;
  selectable?: boolean
  highlight?: boolean;
}

const Seperator = () => <span className={styles.seperator} />;

const Story: React.FC<ListitemProps> = memo(
  ({
    item,
    className,
    selectable,
    highlight,
  }) => {

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

    const titleKey = "title" in item ? "title" : "story_title";
    const title =
      (highlight && item._highlightResult[titleKey]?.value) ||
      item[titleKey] ||
      "";

    const classNames = [styles.content, className]
      .filter(Boolean)
      .join(" ")
      .trim();

    return (
        <Content className={classNames} {...contentProps}>
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
    );
  }
);

export default Story;
