import SvgDone from "../icons/Done";
import Icon from "./Icon";
import styles from "./SuccessText.module.css";

interface Props {
  text: string;
}

const SuccessText = ({ text }: Props) => (
  <div className={styles.text}>
    <Icon glyph={SvgDone} className={styles.icon} /> {text}
  </div>
);

export default SuccessText;
