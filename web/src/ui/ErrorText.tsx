import SvgError from "../icons/Error";
import styles from "./ErrorText.module.css";
import Icon from "./Icon";

interface Props {
  text: string;
}

const ErrorText = ({ text }: Props) => (
  <div className={styles.text}>
    <Icon glyph={SvgError} className={styles.icon} /> {text}
  </div>
);

export default ErrorText;
