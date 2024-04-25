import classNames from "classnames";
import { PropsWithChildren } from "react";
import styles from "../ui/Button.module.css";
import { LoadingSpinner } from "./LoadingSpinner";

type Props = PropsWithChildren<{
  type?: "button" | "submit";
  onClick?: () => void;
  fullWidth?: boolean;
  isLoading?: boolean;
  scheme?: "primary" | "secondary";
}>;

const Button = ({
  type = "button",
  onClick,
  fullWidth = false,
  scheme = "primary",
  isLoading,
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
    {isLoading && <LoadingSpinner size="small" scheme="dark" />}
    {children}
  </button>
);

export default Button;
