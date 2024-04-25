import { PropsWithChildren } from "react";
import EmptyPage from "./EmptyPage";
import styles from "./ErrorPage.module.css";

type Props = PropsWithChildren<{
  title: string;
}>;

const ErrorPage = ({ title, children }: Props) => (
  <EmptyPage title={title}>
    <div className={styles.status}>{children}</div>
  </EmptyPage>
);

export default ErrorPage;
