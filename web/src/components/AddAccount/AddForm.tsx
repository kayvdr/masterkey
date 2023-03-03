import classNames from "classnames";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getPlatforms, setUser } from "../../http/api";
import { Platform } from "../../types";
import Button from "../../ui/Button";
import styles from "../AddAccount/AddForm.module.css";

export interface FormUser {
  platform: string;
  username: string;
  password: string;
  privacy: boolean;
  honeypot: string;
}

interface Error {
  code: number;
  message: string;
}

const AddForm = () => {
  const [platforms, setPlatforms] = useState<Platform[]>();
  const [error, setError] = useState<Error>();
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
        <div className={styles.field}>
          <select
            className={styles.select}
            {...register("platform", { required: "Please choose a platform" })}
            defaultValue=""
          >
            <option value="" disabled={true}>
              Choose platform...
            </option>
            {platforms?.map((p) => (
              <option key={p.id} value={p.name.toLowerCase()}>
                {p.name}
              </option>
            ))}
          </select>
          {errors.platform && (
            <div className={styles.inputError}>{errors.platform.message}</div>
          )}
        </div>
        <div className={styles.field}>
          <input
            type="text"
            placeholder="Username"
            className={styles.input}
            {...register("username", {
              required: "Please insert the username",
            })}
          />
          {errors.username && (
            <div className={styles.inputError}>{errors.username.message}</div>
          )}
        </div>
        <div className={styles.field}>
          <input
            type="text"
            placeholder="Password"
            className={styles.input}
            {...register("password", {
              required: "Please insert the passwort",
            })}
          />
          {errors.password && (
            <div className={styles.inputError}>{errors.password.message}</div>
          )}
        </div>
        <div className={styles.field}>
          <label>
            <input
              type="checkbox"
              className={styles.input}
              {...register("privacy", {
                required: "Please accept the checkbox",
              })}
            />
            <span
              className={classNames(styles.label, {
                [styles.checkBoxError]: errors.privacy,
              })}
            >
              I agree that this data will be stored and further disseminated
            </span>
          </label>
        </div>
        <input
          type="text"
          className={styles.notvisible}
          {...register("honeypot")}
        />
        <div className={styles.field}>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </div>
  );
};

export default AddForm;
