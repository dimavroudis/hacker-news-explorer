import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import styles from "./styles.module.css";

interface DropdownProps {
  children: React.ReactNode;
  target: HTMLElement | null;
  open?: boolean;
  onClose?: (event: MouseEvent | KeyboardEvent) => void;
}

const getDropdownStyles = (target: HTMLElement | null) => {
  if (!target) {
    return;
  }

  const rect = target.getBoundingClientRect();
  const heightToBottom = window.innerHeight - rect.bottom;

  return {
    top: rect.bottom,
    left: rect.left,
    maxWidth: rect.width,
    maxHeight: heightToBottom < 300 ? heightToBottom : 300,
  };
};

const Dropdown = forwardRef<HTMLDivElement | null, DropdownProps>(
  ({ children, target, open = false, onClose }, ref) => {
    const dropdownRef = useRef<HTMLDivElement>(null);
    const resizeObserver = useRef<ResizeObserver | null>(null);
    const [dropdownStyles, setDropdownStyles] = useState<React.CSSProperties>(
      {}
    );

    useImperativeHandle<HTMLDivElement | null, HTMLDivElement | null>(
      ref,
      () => dropdownRef.current
    );

    const handleClickOutside = useCallback(
      (e: MouseEvent) => {
        if (
          !dropdownRef.current ||
          (dropdownRef.current &&
            dropdownRef.current.contains(e.target as Node))
        ) {
          return;
        }
        if (!target || (target && target.contains(e.target as Node))) {
          return;
        }
        if (onClose) {
          onClose(e);
        }
      },
      [onClose, target]
    );

    const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
        if (e.key === "Escape" && onClose) {
          onClose(e);
        }
        if (e.key === "Tab" && onClose) {
          onClose(e);
        }
      },
      [onClose]
    );

    const handleResize = useCallback(() => {
      setDropdownStyles(getDropdownStyles(target) || dropdownStyles);
    }, [dropdownStyles, target]);

    useEffect(() => {
      if (!open) {
        return;
      }

      handleResize();
      resizeObserver.current = new ResizeObserver(handleResize);
      if (target) {
        resizeObserver.current.observe(window.document.body);
      }

      document.addEventListener("click", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);

      return () => {
        if (resizeObserver.current && target) {
          resizeObserver.current.unobserve(target);
        }

        document.removeEventListener("click", handleClickOutside);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [handleClickOutside, handleKeyDown, open, target]);

    if (!open || !target) {
      return null;
    }

    return (
      <div style={dropdownStyles} className={styles.dropdown} ref={dropdownRef}>
        {children}
      </div>
    );
  }
);

export default Dropdown;
