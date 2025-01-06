import Footer from "../Footer";
import Header from "../Header";

import classNames from "classnames";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { createAccount, getPlatforms } from "../../http/api";
import Button from "../ui/Button";
import ErrorText from "../ui/ErrorText";
import Page from "../ui/Page";
import { default as inputStyles, default as styles } from "./Form.module.css";

interface FormUser {
  platform: string;
  username: string;
  password: string;
  privacy: boolean;
}

const AddAccountPage = () => {
  const { data } = getPlatforms();
  const [error, setError] = useState(false);
  const { session } = useAuth();
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormUser>({
    defaultValues: {
      platform: "",
      username: "",
      password: "",
      privacy: false,
    },
  });

  if (!data) return null;

  return (
    <>
      <Header />
      <Page title="Share your Account with us!" titleCenter={true}>
        <div className={styles.formWrapper}>
          <h2>Please enter the following data.</h2>
          <form className={styles.form}>
            {error && <ErrorText text="An unknown error has occurred." />}
            <div
              className={classNames(inputStyles.field, {
                [inputStyles.fieldError]: errors.platform,
              })}
            >
              <Controller
                name="platform"
                control={control}
                rules={{
                  required: "Platform cannot be empty.",
                  validate: (value) =>
                    value.trim() !== "" || "Platform cannot be empty.",
                }}
                render={({ field }) => (
                  <select {...field}>
                    <option value="">Choose platform...</option>
                    {data?.platforms.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.platform && (
                <div className={styles.inputError}>
                  {errors.platform.message}
                </div>
              )}
            </div>
            <div
              className={classNames(inputStyles.field, {
                [inputStyles.fieldError]: errors.username,
              })}
            >
              <Controller
                name="username"
                control={control}
                rules={{
                  required: "Username cannot be empty.",
                  validate: (value) =>
                    value.trim() !== "" || "Username cannot be empty.",
                }}
                render={({ field }) => (
                  <input
                    type="text"
                    placeholder="Username or Email"
                    className={inputStyles.input}
                    {...field}
                  />
                )}
              />
              {errors.username && (
                <div className={inputStyles.inputError}>
                  {errors.username.message}
                </div>
              )}
            </div>
            <div
              className={classNames(inputStyles.field, {
                [inputStyles.fieldError]: errors.password,
              })}
            >
              <Controller
                name="password"
                control={control}
                rules={{
                  required: "Password cannot be empty.",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters long.",
                  },
                }}
                render={({ field }) => (
                  <input
                    type="text"
                    placeholder="Password"
                    className={inputStyles.input}
                    {...field}
                  />
                )}
              />
              {errors.password && (
                <div className={inputStyles.inputError}>
                  {errors.password.message}
                </div>
              )}
            </div>
            <div
              className={classNames(inputStyles.field, {
                [inputStyles.fieldError]: errors.privacy,
              })}
            >
              <label>
                <Controller
                  name="privacy"
                  control={control}
                  rules={{
                    required: "Checkbox must be accepted.",
                  }}
                  render={({ field }) => (
                    <input
                      type="checkbox"
                      className={styles.input}
                      {...field}
                      value="privacy"
                    />
                  )}
                />
                <span
                  className={classNames(styles.label, {
                    [styles.checkBoxError]: error,
                  })}
                >
                  I agree that this data will be stored and further disseminated
                </span>
              </label>
              {errors.privacy && (
                <div className={inputStyles.inputError}>
                  {errors.privacy.message}
                </div>
              )}
            </div>
            <div className={inputStyles.field}>
              <Button
                type="submit"
                fullWidth={true}
                isLoading={isSubmitting}
                onClick={handleSubmit((body) => {
                  if (!session) return;

                  createAccount(
                    {
                      username: body.username,
                      password: body.password,
                      platform_id: body.platform,
                      creator_id: session.user.id,
                    },
                    session.access_token
                  )
                    .then(() => {
                      setError(false);
                      navigate("/search");
                    })
                    .catch(() => setError(true));
                })}
              >
                Add Account
              </Button>
            </div>
          </form>
        </div>
      </Page>
      <Footer />
    </>
  );
};

export default AddAccountPage;
