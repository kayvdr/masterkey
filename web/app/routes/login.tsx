import { MetaFunction } from "@remix-run/react";
import classNames from "classnames";
import { useContext } from "react";
import { Controller, useForm } from "react-hook-form";
import { Form, useNavigate } from "react-router-dom";
import inputStyles from "../components/Account/Form.module.css";
import styles from "../components/Auth/AuthPage.module.css";
import Button from "../components/ui/Button";
import { useAuth } from "../context/authContext";
import NotificationContext, {
  showErrorNotification,
} from "../context/notificationContext";

export const meta: MetaFunction = () => [
  { title: "Sign In to MasterKey – Access & Share Accounts" },
  {
    name: "description",
    content:
      "Log in to MasterKey to manage shared accounts, contribute, and vote for the best access options. Join the community today!",
  },
];

interface FormLogin {
  email: string;
  password: string;
}

const Login = () => {
  const { auth } = useAuth();
  const dispatch = useContext(NotificationContext);
  const navigate = useNavigate();
  const {
    reset,
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
  } = useForm<FormLogin>({ defaultValues: { email: "", password: "" } });

  const onSubmit = async (formData: FormLogin) => {
    const { error } = await auth.signInWithPassword(formData);

    if (error?.status) {
      dispatch(showErrorNotification(error.message));
      return;
    }

    reset();
    navigate("/profile");
  };

  return (
    <section className={styles.loginSection}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Welcome back!</h1>
        <Form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
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
            className={classNames(inputStyles.fieldNoMargin, {
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
          <div className={styles.resetContainer}>
            <a href="/password/forgot" className={styles.resetBtn}>
              Forgot password?
            </a>
          </div>
          <div className={styles.field}>
            <Button type="submit" fullWidth={true} isLoading={isSubmitting}>
              Sign in
            </Button>
          </div>
        </Form>
        <div className={styles.or}>
          <hr />
          OR
          <hr />
        </div>
        <div className={styles.list}>
          <a href="/register" className={styles.btn}>
            No Account? Register here!
          </a>
          {/* TODO: Delete or add those login possibilities */}
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
          <a href="/privacy">Privacy</a>
          <span className={styles.separator}>•</span>
          <a href="/imprint">Imprint</a>
        </p>
      </div>
    </section>
  );
};

export default Login;
