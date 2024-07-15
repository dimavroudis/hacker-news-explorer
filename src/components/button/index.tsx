import React, { memo } from "react";
import styles from "./styles.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button: React.FC<ButtonProps> = memo(({ children, ...props }) => {
  const classNames = [styles.button, props.className].filter(Boolean).join(" ");

  return (
    <button className={classNames} {...props}>
      {children}
    </button>
  );
});

export default Button;
