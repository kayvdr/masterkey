import classNames from "classnames";
import { FieldError } from "react-hook-form";
import styles from "./InputField.module.css";

interface Props {
  placeholder: string;
  error: FieldError | undefined;
  register: any;
  value?: string;
  className?: { field?: string; input?: string };
  type?: "text" | "email" | "password";
}

const InputField = ({
  placeholder,
  error,
  register,
  value,
  className,
  type = "text",
}: Props) => (
  <div className={classNames(styles.field, className?.field)}>
    <input
      type={type}
      placeholder={placeholder}
      className={classNames(styles.input, className?.input)}
      value={value}
      {...register}
    />
    {error && <div className={styles.inputError}>{error.message}</div>}
  </div>
);

export default InputField;
