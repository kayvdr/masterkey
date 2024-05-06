import classNames from "classnames";
import { PropsWithChildren } from "react";
import styles from "./Page.module.css";

type Props = PropsWithChildren<{
  title?: string;
  titleAlign?: "left" | "center";
}>;

const Page = ({ title, titleAlign = "left", children }: Props) => (
  <main className={styles.page}>
    <div className="container">
      {title && (
        <h1
          className={classNames(styles.title, {
            [styles.center]: titleAlign === "center",
          })}
        >
          {title}
        </h1>
      )}
      {children}
    </div>
  </main>
);

export default Page;
