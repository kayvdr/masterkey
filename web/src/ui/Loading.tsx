import classNames from "classnames";
import styles from "./Loading.module.css";

interface Props {
  size?: "small" | "default";
  scheme?: "light" | "dark";
}

export const Loading = ({ size = "default", scheme = "light" }: Props) => (
  <div
    className={classNames(styles.loader, {
      [styles.small]: size === "small",
      [styles.dark]: scheme === "dark",
    })}
  ></div>
);
