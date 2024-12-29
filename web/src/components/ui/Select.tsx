import { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { Platform } from "../../types";
import styles from "./InputField.module.css";

interface Props {
  placeholder: string;
  error: FieldError | undefined;
  register: UseFormRegisterReturn<string>;
  options: Platform[] | undefined;
}

const Select = ({ placeholder, error, register, options }: Props) => (
  <div className={styles.field}>
    <select className={styles.select} {...register}>
      <option value="" disabled={true}>
        {placeholder}
      </option>
      {options?.map((p) => (
        <option key={p.id} value={p.id}>
          {p.name}
        </option>
      ))}
    </select>
    {error && <div className={styles.inputError}>{error.message}</div>}
  </div>
);

export default Select;
