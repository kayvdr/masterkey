import classNames from "classnames";
import { FieldError } from "react-hook-form";
import styles from "./InputField.module.css";

interface Props {
  text: string;
  error: FieldError | undefined;
  register: any;
}

const InputCheckBox = ({ text, error, register }: Props) => (
  <div className={styles.field}>
    <label>
      <input type="checkbox" className={styles.input} {...register} />
      <span
        className={classNames(styles.label, {
          [styles.checkBoxError]: error,
        })}
      >
        {text}
      </span>
    </label>
    {error && <div className={styles.inputError}>{error.message}</div>}
  </div>
);

export default InputCheckBox;
