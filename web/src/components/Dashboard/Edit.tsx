import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "../../http/supabase";
import Button from "../../ui/Button";
import Icon from "../../ui/Icon";
import InputField from "../../ui/InputField";
import styles from "../Dashboard/DashboardPage.module.css";
import SvgEdit from "../icons/Edit";

interface Props {
  name: string;
  value: string;
  label: string;
}

interface Type {
  [value: string]: string;
}

const Edit = ({ name, value, label }: Props) => {
  const [editToggle, setEditToggle] = useState({
    [value]: false,
  });
  const {
    register,
    reset,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<{ [name: string]: string }>({
    defaultValues: {
      [name]: name !== "password" ? value : "",
    },
  });

  const onSubmit = async (inputs: Type) => {
    const { error } = await supabase.auth.updateUser({
      [value]: inputs,
    });

    if (error) return setError(error.name, error);

    reset();
    setEditToggle({ ...editToggle, [name]: false });
  };

  return (
    <>
      {!editToggle[name] ? (
        <div className={styles.profileItem}>
          <p className={styles.itemValue}>{value}</p>
          <button
            className={styles.editBtn}
            onClick={() => setEditToggle({ ...editToggle, [name]: true })}
          >
            <Icon glyph={SvgEdit} />
          </button>
        </div>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <InputField
            placeholder={label}
            type={name === "email" || name === "password" ? name : "text"}
            register={{
              ...register(name, {
                required: `Please insert the ${label}`,
              }),
            }}
            error={errors[name]}
            className={{ field: styles.input }}
          />
          <Button type="submit">Save</Button>
        </form>
      )}
    </>
  );
};

export default Edit;
