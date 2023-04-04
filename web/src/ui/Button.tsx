import classNames from "classnames";
import { PropsWithChildren } from "react";
import styles from "../ui/Button.module.css";

type Props = PropsWithChildren<{
  type?: "button" | "submit";
  onClick?: () => void;
  fullWidth?: boolean;
  scheme?: "primary" | "secondary";
}>;

const Button = ({
  type = "button",
  onClick,
  fullWidth = false,
  scheme = "primary",
  children,
}: Props) => (
  <button
    type={type}
    className={classNames(styles.btn, {
      [styles.primary]: scheme === "primary",
      [styles.secondary]: scheme === "secondary",
      [styles.fullWidth]: fullWidth,
    })}
    onClick={onClick}
  >
    {children}
  </button>
);

export default Button;
