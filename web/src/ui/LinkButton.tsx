import classNames from "classnames";
import { PropsWithChildren } from "react";
import { NavLink } from "react-router-dom";
import styles from "../ui/Button.module.css";

type Props = PropsWithChildren<{
  to: string;
  scheme?: "primary" | "secondary";
}>;

const LinkButton = ({ to, scheme = "primary", children }: Props) => (
  <NavLink
    className={classNames(styles.btn, {
      [styles.primary]: scheme === "primary",
      [styles.secondary]: scheme === "secondary",
    })}
    to={to}
  >
    {children}
  </NavLink>
);

export default LinkButton;
