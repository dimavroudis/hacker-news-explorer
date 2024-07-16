import { memo } from "react";
import styles from "./styles.module.css";

interface ListitemProps {
  selected?: boolean;
  posinset?: number;
  setsize?: number;
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  onMouseEnter?: (e: React.MouseEvent) => void;
  onMouseMove?: (e: React.MouseEvent) => void;
  className?: string;
  id?: string;
}

const Listitem: React.FC<ListitemProps> = memo(
  ({
    id,
    children,
    onClick,
    onMouseEnter,
    onMouseMove,
    className,
    selected,
    setsize,
    posinset,
  }) => {
    const classNames = [styles.container, className]
      .filter(Boolean)
      .join(" ")
      .trim();

    return (
      <div
        id={id}
        className={classNames}
        role="option"
        aria-selected={selected}
        aria-setsize={setsize}
        aria-posinset={posinset}
        onMouseEnter={onMouseEnter}
        onMouseMove={onMouseMove}
        onClick={onClick}
      >
        {children}
      </div>
    );
  }
);

export default Listitem;
