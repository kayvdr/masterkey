import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createAccount, getPlatforms, updateAccount } from "../../http/api";
import { Account, CustomError, Platform } from "../../types";
import Button from "../../ui/Button";
import InputCheckBox from "../../ui/InputCheckBox";
import InputField from "../../ui/InputField";
import Select from "../../ui/Select";
import { SessionContext } from "../AppRouter";
import styles from "./AccountForm.module.css";

interface Props {
  user?: Account;
}

interface FormUser {
  platform: string;
  username: string;
  password: string;
  privacy: boolean;
  honeypot: string;
}

const AddForm = ({ user: account }: Props) => {
  const [platforms, setPlatforms] = useState<Platform[]>();
  const [error, setError] = useState<CustomError>();
  const session = useContext(SessionContext);
  const navigate = useNavigate();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FormUser>({
    defaultValues: {
      username: account?.username,
      password: account?.password,
    },
  });

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = getPlatforms();

      setPlatforms(data?.platforms);
      reset({ platform: account?.platform_name?.toLowerCase() });
    };

    fetchUsers();
  }, []);

  const onSubmit = async (data: FormUser) => {
    setError(undefined);
    if (data.honeypot)
      return setError({ code: 400, message: "Something went wrong!" });

    const { username, password, platform } = data;

    const currPlatform = platforms?.find(
      ({ name }) => name.toLowerCase() === platform
    );

    if (!currPlatform)
      return setError({ code: 404, message: "Platform not found" });

    if (account?.id) {
      updateAccount(account.id, {
        username,
        password,
        platform_id: currPlatform.id,
      });
    } else {
      session &&
        createAccount({
          username,
          password,
          platform_id: currPlatform.id,
          creator_id: session?.user.id,
        });
    }

    reset();
    account && navigate(-1);
  };

  return (
    <div className={styles.formWrapper}>
      <h2 className={styles.subtitle}>Please enter the following data.</h2>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        {/* {isSuccessful && (
          <div className={styles.success}>Added successfully!</div>
        )} */}
        {error && <div className={styles.fail}>{error.message}</div>}
        <Select
          placeholder="Choose platform..."
          register={{
            ...register("platform", {
              required: "Please choose a platform",
            }),
          }}
          options={platforms}
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
        {!account && (
          <InputCheckBox
            register={{
              ...register("privacy", {
                required: "Please accept the checkbox",
              }),
            }}
            error={errors.privacy}
            text="I agree that this data will be stored and further disseminated"
          />
        )}
        <input
          type="text"
          className={styles.notvisible}
          {...register("honeypot")}
        />
        <div className={styles.field}>
          <Button type="submit" fullWidth={true}>
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddForm;
