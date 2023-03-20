import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getPlatforms, setUser } from "../../http/api";
import { CustomError, Platform } from "../../types";
import Button from "../../ui/Button";
import InputCheckBox from "../../ui/InputCheckBox";
import InputField from "../../ui/InputField";
import Select from "../../ui/Select";
import styles from "../AddAccount/AddForm.module.css";

interface FormUser {
  platform: string;
  username: string;
  password: string;
  privacy: boolean;
  honeypot: string;
}

const AddForm = () => {
  const [platforms, setPlatforms] = useState<Platform[]>();
  const [error, setError] = useState<CustomError>();
  const [isSuccessful, setIsSuccessful] = useState(false);
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FormUser>();

  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedPlatforms = await getPlatforms();

      setPlatforms(fetchedPlatforms);
    };

    fetchUsers();
  }, []);

  const onSubmit = async (data: FormUser) => {
    if (data.honeypot)
      return setError({ code: 400, message: "Something went wrong!" });

    const { username, password, platform } = data;

    const platformId = platforms?.find(
      ({ name }) => name.toLowerCase() === platform
    );

    if (!platformId)
      return setError({ code: 404, message: "Platform not found" });

    setUser({
      username,
      password,
      platform_id: platformId.id,
    }).then(async (response) => {
      const res = await response.json();
      !response.ok ? setError(res.error) : setIsSuccessful(true);
    });

    reset();
  };

  return (
    <div className={styles.formWrapper}>
      <h2 className={styles.subtitle}>Please enter the following data.</h2>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        {isSuccessful && (
          <div className={styles.success}>Added successfully!</div>
        )}
        {error && <div className={styles.fail}>{error.message}</div>}
        <Select
          placeholder="Choose platform..."
          register={{
            ...register("platform", { required: "Please choose a platform" }),
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
        <InputCheckBox
          register={{
            ...register("privacy", {
              required: "Please accept the checkbox",
            }),
          }}
          error={errors.privacy}
          text="I agree that this data will be stored and further disseminated"
        />
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
