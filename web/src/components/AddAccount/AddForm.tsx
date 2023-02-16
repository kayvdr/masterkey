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

const AddForm = () => {
  const [platforms, setPlatforms] = useState<Platform[]>();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<FormUser>();

  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedPlatforms = await getPlatforms();

      setPlatforms(fetchedPlatforms);
    };

    fetchUsers();
  }, []);

  const onSubmit = (data: FormUser) => {
    if (data.honeypot) return console.error("Something went wrong!");

    const { username, password, platform } = data;
    setUser({
      username,
      password,
      platform_id: platform,
    });

    reset();
  };

  return (
    <div className={styles.formWrapper}>
      <h2 className={styles.subtitle}>Please enter the following data.</h2>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        {isSubmitSuccessful && (
          <div className={styles.success}>Data send successfully!</div>
        )}
        <div className={styles.field}>
          <select
            className={styles.select}
            {...register("platform", { required: "Please choose a platform" })}
            defaultValue="default"
          >
            <option value="default" disabled={true}>
              Choose platform...
            </option>
            {platforms?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          {errors?.platform && <p>{errors.platform.message}</p>}
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
          {errors?.username && <p>{errors.username.message}</p>}
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
          {errors?.password && <p>{errors.password.message}</p>}
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
            <span className={styles.label}>
              I agree that this data will be stored and further disseminated
            </span>
          </label>
          {errors?.privacy && <p>{errors.privacy.message}</p>}
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
