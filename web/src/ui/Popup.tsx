import Button from "./Button";
import styles from "./Popup.module.css";

interface Props {
  title: string;
  text: string;
  onSubmit: () => void;
  onClose: () => void;
}

const Popup = ({ title, text, onSubmit, onClose }: Props) => (
  <div className={styles.popup}>
    <div className={styles.popupOverlay} onClick={onClose}></div>
    <div className={styles.popupContainer}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.text}>{text}</p>
      <div className={styles.btnRow}>
        <Button onClick={onClose} scheme="secondary">
          Cancel
        </Button>
        <Button onClick={onSubmit}>Submit</Button>
      </div>
    </div>
  </div>
);

export default Popup;
