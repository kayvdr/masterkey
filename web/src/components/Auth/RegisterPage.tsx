import classNames from "classnames";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { CustomError } from "../../types";
import inputStyles from "../Account/Form.module.css";
import Button from "../ui/Button";
import ErrorText from "../ui/ErrorText";
import styles from "./AuthPage.module.css";

interface FormLogin {
  name: string;
  email: string;
  password: string;
}

const RegisterPage = () => {
  const [error, setError] = useState<CustomError>();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const {
    reset,
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
  } = useForm<FormLogin>({
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = async (formData: FormLogin) => {
    const { error } = await auth.signUp(formData);
    if (error?.status) {
      setError({ code: error.status, message: error.message });
      return;
    }
    reset();
    navigate("/login");
  };

  return (
    <section className={styles.loginSection}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Register</h1>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          {error && <ErrorText text={error.message} />}
          <div
            className={classNames(inputStyles.field, {
              [inputStyles.fieldError]: errors.name,
            })}
          >
            <Controller
              name="name"
              control={control}
              rules={{
                required: "Name cannot be empty.",
              }}
              render={({ field }) => (
                <input
                  type="text"
                  placeholder="Name"
                  className={inputStyles.input}
                  {...field}
                />
              )}
            />
            {errors.name && (
              <div className={inputStyles.inputError}>
                {errors.name.message}
              </div>
            )}
          </div>
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
          <NavLink className={styles.btn} to="/login">
            Already Registered? Login here!
          </NavLink>
          {/* <button className={styles.btn}>
            <Icon glyph={SvgGoogle} className={styles.provider} /> Login with
            Google
          </button>
          <button className={styles.btn}>
            <Icon glyph={SvgFacebookBlack} className={styles.provider} />
            Login with Facebook
          </button> */}
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

export default RegisterPage;
