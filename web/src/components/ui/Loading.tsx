import styles from "./Loading.module.css";
import { LoadingSpinner } from "./LoadingSpinner";

interface Props {
  size?: "small" | "default";
  scheme?: "light" | "dark";
}

export const Loading = ({ size = "default", scheme = "light" }: Props) => (
  <div className={styles.loaderWrapper}>
    <LoadingSpinner size={size} scheme={scheme} />
  </div>
);
