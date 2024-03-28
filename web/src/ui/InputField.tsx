import { FieldError } from "react-hook-form";
import styles from "./InputField.module.css";

interface Props {
  placeholder: string;
  error: FieldError | undefined;
  register: any;
  value?: string;
  type?: "text" | "email" | "password";
}

const InputField = ({
  placeholder,
  error,
  register,
  value,
  type = "text",
}: Props) => (
  <div className={styles.field}>
    <input
      type={type}
      placeholder={placeholder}
      className={styles.input}
      value={value}
      {...register}
    />
    {error && <div className={styles.inputError}>{error.message}</div>}
  </div>
);

export default InputField;
