import classNames from "classnames";
import { PropsWithChildren } from "react";
import styles from "./Container.module.css";

type Props = PropsWithChildren<{
  className?: string;
}>;

const Container = ({ className, children }: Props) => (
  <div className={classNames(styles.container, className)}>{children}</div>
);

export default Container;
