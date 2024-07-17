import { memo } from "react";
import styles from "./styles.module.css";
import { CommentHighlightResult, StoryHighlightResult } from "../../types/api";

interface ListitemProps {
  title: string;
  author: string;
  points: number | null;
  num_comments?: number;
  url?: string;
  className?: string;
  selectable?: boolean;
  highlightResults?: StoryHighlightResult | CommentHighlightResult;
}

/**
 * Highlight the content of the story
 *
 * @param value - The value to highlight
 * @returns The highlighted content
 */
const highlightContent = (value: string) => {
  const children = [];
  const splitedValue = value.split(/(<em>|<\/em>)/);

  let isHighlighted = false;

  for (let i = 0; i < splitedValue.length; i++) {
    const curr = splitedValue[i];
    if (curr === "<em>") {
      isHighlighted = true;
      continue;
    }
    if (curr === "</em>") {
      isHighlighted = false;
      continue;
    }
    if (isHighlighted) {
      children.push(<mark key={i}>{curr}</mark>);
    } else {
      children.push(curr);
    }
  }

  return children;
};

const Seperator = () => <span className={styles.seperator} />;

const StoryDisplay: React.FC<ListitemProps> = memo(
  ({
    className,
    highlightResults,
    title,
    author,
    points,
    num_comments,
    url,
  }) => {
    const titleText = highlightResults
      ? highlightContent(
          highlightResults.title
            ? highlightResults.title.value
            : highlightResults.story_title.value
        )
      : title;
    const pointsText = !points
      ? "No points"
      : points === 1
      ? "1 point"
      : `${points} points`;
    const authorText = !author
      ? "No author"
      : ` by ${
          highlightResults
            ? highlightContent(highlightResults.author.value)
            : author
        }`;
    const commentsText = !num_comments
      ? "No comments"
      : num_comments === 1
      ? "1 comment"
      : `${num_comments} comments`;

    const Content = !url ? "div" : "a";
    const contentProps = url ? { href: url, target: "_blank" } : {};

    const classNames = [styles.content, className]
      .filter(Boolean)
      .join(" ")
      .trim();

    return (
      <Content className={classNames} {...contentProps}>
        <h3 className={styles.title}>{titleText}</h3>
        <p className={styles.meta}>
          <span>{pointsText}</span>
          <Seperator />
          <span>{authorText}</span>
          <Seperator />
          <span>{commentsText}</span>
        </p>
      </Content>
    );
  }
);

export default StoryDisplay;
