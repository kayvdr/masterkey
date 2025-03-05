import classNames from "classnames";
import { useContext } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import NotificationContext, {
  showErrorNotification,
  showSuccessNotification,
} from "../../context/notificationContext";
import inputStyles from "../Account/Form.module.css";
import Button from "../ui/Button";
import styles from "./AuthPage.module.css";

interface FormLogin {
  name: string;
  email: string;
  password: string;
}

const RegisterPage = () => {
  const dispatch = useContext(NotificationContext);
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
      dispatch(showErrorNotification(error.message));
      return;
    }

    dispatch(showSuccessNotification("Confirmation Email send successfully"));
    reset();
    navigate("/login");
  };

  return (
    <section className={styles.loginSection}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Create an Account</h1>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
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
              Sign up
            </Button>
          </div>
        </form>
        <div className={styles.or}>
          <hr />
          OR
          <hr />
        </div>
        <div className={styles.list}>
          <a href="/login" className={styles.btn}>
            Already Registered? Login here!
          </a>
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

export default RegisterPage;
