import { useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../../http/supabase";
import { CustomError } from "../../types";
import Button from "../../ui/Button";
import Icon from "../../ui/Icon";
import InputField from "../../ui/InputField";
import SvgFacebookBlack from "../icons/FacebookBlack";
import SvgGoogle from "../icons/Google";
import styles from "./AuthPage.module.css";

interface FormLogin {
  email: string;
  password: string;
}

const LoginPage = () => {
  const [error, setError] = useState<CustomError>();
  const navigate = useNavigate();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FormLogin>();

  const onSubmit = async (formData: FormLogin) => {
    setError(undefined);
    const { error } = await supabase.auth.signInWithPassword(formData);

    if (error?.status) {
      setTimeout(() => {
        setError({ code: error.status ?? 400, message: error.message });
      }, 500);

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
          {error && <div className={styles.fail}>{error.message}</div>}
          <InputField
            placeholder="E-Mail"
            type="email"
            register={{
              ...register("email", {
                required: "Please insert the E-Mail",
              }),
            }}
            error={errors.email}
          />
          <InputField
            placeholder="Password"
            type="password"
            register={{
              ...register("password", {
                required: "Please insert the passwort",
              }),
            }}
            error={errors.password}
          />
          <div className={styles.field}>
            <Button type="submit" fullWidth={true}>
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
