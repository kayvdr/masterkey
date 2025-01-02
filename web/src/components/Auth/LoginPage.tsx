import classNames from "classnames";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { CustomError } from "../../types";
import inputStyles from "../Account/Form.module.css";
import SvgFacebookBlack from "../icons/FacebookBlack";
import SvgGoogle from "../icons/Google";
import Button from "../ui/Button";
import ErrorText from "../ui/ErrorText";
import Icon from "../ui/Icon";
import styles from "./AuthPage.module.css";

interface FormLogin {
  email: string;
  password: string;
}

const LoginPage = () => {
  const { auth } = useAuth();
  const [error, setError] = useState<CustomError>();
  const navigate = useNavigate();
  const {
    reset,
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
  } = useForm<FormLogin>({ defaultValues: { email: "", password: "" } });

  const onSubmit = async (formData: FormLogin) => {
    setError(undefined);
    const { error } = await auth.signInWithPassword(formData);

    if (error?.status) {
      setError({ code: error.status ?? 400, message: error.message });
      return;
    }

    reset();
    navigate("/profile");
  };

  return (
    <section className={styles.loginSection}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Login</h1>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          {error && <ErrorText text={error.message} />}
          <div
            className={classNames(inputStyles.field, {
              [inputStyles.fieldError]: errors.email,
            })}
          >
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email cannot be empty.",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "The email is not a valid email address.",
                },
              }}
              render={({ field }) => (
                <input
                  type="email"
                  placeholder="Email"
                  className={inputStyles.input}
                  {...field}
                />
              )}
            />
            {errors.email && (
              <div className={inputStyles.inputError}>
                {errors.email.message}
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
              }}
              render={({ field }) => (
                <input
                  type="password"
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
          <div className={styles.field}>
            <Button type="submit" fullWidth={true} isLoading={isSubmitting}>
              Submit
            </Button>
          </div>
        </form>
        <div className={styles.or}>
          <hr />
          OR
          <hr />
        </div>
        <div className={styles.list}>
          <NavLink className={styles.btn} to="/register">
            No Account? Register here!
          </NavLink>
          {/* TODO: Delete or add those login possibilities */}
          <button className={styles.btn}>
            <Icon glyph={SvgGoogle} className={styles.provider} /> Login with
            Google
          </button>
          <button className={styles.btn}>
            <Icon glyph={SvgFacebookBlack} className={styles.provider} />
            Login with Facebook
          </button>
        </div>
        <p className={styles.footer}>
          <NavLink to="/privacy">Privacy</NavLink>
          <span className={styles.separator}>•</span>
          <NavLink to="/imprint">Imprint</NavLink>
        </p>
      </div>
    </section>
  );
};

export default LoginPage;
