import classNames from "classnames";
import { PropsWithChildren } from "react";
import Container from "../Container";
import styles from "./Page.module.css";

type Props = PropsWithChildren<{
  title?: string;
  titleCenter?: boolean;
}>;

const Page = ({ title, titleCenter = false, children }: Props) => (
  <main className={styles.page}>
    <Container>
      {title && (
        <h1
          className={classNames(styles.title, {
            [styles.center]: titleCenter,
          })}
        >
          {title}
        </h1>
      )}
      {children}
    </Container>
  </main>
);

export default Page;
