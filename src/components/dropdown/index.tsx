import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import styles from "./styles.module.css";

interface DropdownProps {
  children: React.ReactNode;
  target: HTMLElement | null;
  open?: boolean;
  onClose?: (event: MouseEvent | KeyboardEvent) => void;
}

const getDropdownStyles = (target: HTMLElement) => {
  if (!target) {
    return;
  }

  const rect = target.getBoundingClientRect();
  return {
    top: rect.bottom,
    left: rect.left,
    maxWidth: rect.width,
  };
};

const Dropdown = forwardRef<HTMLDivElement | null, DropdownProps>(
  ({ children, target, open = false, onClose }, ref) => {
    const dropdownRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
      if (!open) {
        return;
      }
      document.addEventListener("click", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("click", handleClickOutside);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [handleClickOutside, handleKeyDown, open]);

    if (!open || !target) {
      return null;
    }

    const position = getDropdownStyles(target);

    return (
      <div style={position} className={styles.dropdown} ref={dropdownRef}>
        {children}
      </div>
    );
  }
);

export default Dropdown;
