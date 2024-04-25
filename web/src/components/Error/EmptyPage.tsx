import { PropsWithChildren, ReactNode } from "react";
import styles from "./EmptyPage.module.css";

type Props = PropsWithChildren<{
  title: string;
  image?: string;
  button?: ReactNode;
}>;

const EmptyPage = ({ title, image, button, children }: Props) => (
  <div className={styles.emptyPage}>
    <h1 className={styles.title}>{title}</h1>
    {children && <div className={styles.text}>{children}</div>}
    {image && <img src={image} className={styles.image} alt={title} />}
    {button && <div className={styles.btnContainer}>{button}</div>}
  </div>
);

export default EmptyPage;
