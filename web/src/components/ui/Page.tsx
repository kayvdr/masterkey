import { PropsWithChildren } from "react";
import styles from "./Page.module.css";

type Props = PropsWithChildren<{
  title?: string;
}>;

const Page = ({ title, children }: Props) => (
  <main className={styles.page}>
    {title && <h1 className={styles.title}>{title}</h1>}
    {children}
  </main>
);

export default Page;
