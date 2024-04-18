import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { getPlatforms, updateAccount } from "../../http/api";
import { Account } from "../../types";
import Button from "../../ui/Button";
import ErrorText from "../../ui/ErrorText";
import InputField from "../../ui/InputField";
import Select from "../../ui/Select";
import SuccessText from "../../ui/SuccessText";
import styles from "./Form.module.css";

interface FormUser {
  platform: string;
  username: string;
  password: string;
}
interface Props {
  account: Account;
}

const EditForm = ({ account }: Props) => {
  const { data } = getPlatforms();
  const [error, setError] = useState(false);
  const { session } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<FormUser>({
    defaultValues: {
      username: account.username,
      password: account.password,
      platform: account.platform_id,
    },
  });

  return (
    <div className={styles.formWrapper}>
      <h2 className={styles.subtitle}>Please enter the following data.</h2>
      <form className={styles.form}>
        {isSubmitSuccessful && !error && (
          <SuccessText text="Edited successfully!" />
        )}
        {error && !isSubmitting && (
          <ErrorText text="An unknown error has occurred." />
        )}
        <Select
          placeholder="Choose platform..."
          register={{
            ...register("platform", {
              required: "Please choose a platform",
            }),
          }}
          options={data?.platforms}
          error={errors.platform}
        />
        <InputField
          placeholder="Username"
          register={{
            ...register("username", {
              required: "Please insert the username",
            }),
          }}
          error={errors.username}
        />
        <InputField
          placeholder="Password"
          register={{
            ...register("password", {
              required: "Please insert the passwort",
            }),
          }}
          error={errors.password}
        />
        <div className={styles.field}>
          <Button
            type="submit"
            fullWidth={true}
            isLoading={isSubmitting}
            onClick={handleSubmit((body) => {
              if (!session) return;

              updateAccount(account.id, {
                username: body.username,
                password: body.password,
                platform_id: body.platform,
              })
                .then(() => {
                  setError(false);
                  setTimeout(() => {
                    navigate("/search");
                  }, 2500);
                })
                .catch(() => setError(true));
            })}
          >
            Edit Account
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditForm;
