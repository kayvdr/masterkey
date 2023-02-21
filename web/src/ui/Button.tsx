import classNames from "classnames";
import { PropsWithChildren } from "react";
import { Glyph } from "../types";
import styles from "../ui/Button.module.css";
import Icon from "./Icon";

type Props = PropsWithChildren<{
  type?: "button" | "submit";
  icon?: Glyph;
  onClick?: () => void;
  className?: string;
}>;

const Button = ({
  type = "button",
  icon,
  onClick,
  className,
  children,
}: Props) => (
  <button
    type={type}
    className={classNames(styles.btn, className)}
    onClick={onClick}
  >
    {icon && <Icon glyph={icon} className={styles.icon} />}
    {children}
  </button>
);

export default Button;
