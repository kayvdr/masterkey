import { MetaFunction } from "@remix-run/react";
import classNames from "classnames";
import { useContext } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import inputStyles from "../components/Account/Form.module.css";
import styles from "../components/Auth/AuthPage.module.css";
import Button from "../components/ui/Button";
import { useAuth } from "../context/authContext";
import NotificationContext, {
  showErrorNotification,
  showSuccessNotification,
} from "../context/notificationContext";

export const meta: MetaFunction = () => [
  { title: "Reset Password – Recover Your MasterKey Access" },
  {
    name: "description",
    content:
      "Forgot your password? Reset it securely and regain access to your MasterKey account in minutes.",
  },
];

interface FormLogin {
  email: string;
}

const ForgotPassword = () => {
  const { auth } = useAuth();
  const dispatch = useContext(NotificationContext);
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
  } = useForm<FormLogin>({ defaultValues: { email: "" } });

  const onSubmit = async (formData: FormLogin) => {
    const { error } = await auth.resetPasswordForEmail(formData.email);

    if (error) {
      dispatch(showErrorNotification(error.message));
      return;
    }

    dispatch(showSuccessNotification("Email send successfully"));
    navigate("/");
  };

  return (
    <section className={styles.loginSection}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Forgot Password</h1>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
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
          <div className={styles.field}>
            <Button type="submit" fullWidth={true} isLoading={isSubmitting}>
              Send password reset link
            </Button>
          </div>
        </form>
        <div className={styles.listMargin}>
          <a href="/login" className={styles.btn}>
            Go Back
          </a>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
