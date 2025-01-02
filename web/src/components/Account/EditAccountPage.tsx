import classNames from "classnames";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { getAccount, getPlatforms, updateAccount } from "../../http/api";
import { Account } from "../../types";
import Footer from "../Footer";
import Header from "../Header";
import Button from "../ui/Button";
import ErrorText from "../ui/ErrorText";
import Page from "../ui/Page";
import { default as inputStyles, default as styles } from "./Form.module.css";

interface FormUser {
  platform: string;
  username: string;
  password: string;
}

const EditAccountPage = () => {
  const params = useParams<"accountId">();

  const { data: account } = getAccount(params.accountId);

  if (!account) return null;

  return (
    <>
      <Header />
      <Page title="Edit your shared Account!" titleCenter={true}>
        <div className={styles.formWrapper}>
          <h2 className={styles.subtitle}>Please enter the following data.</h2>
          <EditForm account={account} />
        </div>
      </Page>
      <Footer />
    </>
  );
};

interface FormProps {
  account: Account;
}

const EditForm = ({ account }: FormProps) => {
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
      username: account.username,
      password: account.password,
      platform: account.platform_id,
    },
  });

  return (
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
          render={({ field }) => (
            <select {...field}>
              <option value="" disabled={true}>
                Choose platform...
              </option>
              {data?.platforms.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          )}
        />
        {errors.platform && (
          <div className={styles.inputError}>{errors.platform.message}</div>
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
      <div className={styles.field}>
        <Button
          type="submit"
          fullWidth={true}
          isLoading={isSubmitting}
          onClick={handleSubmit((body) => {
            if (!session) return;

            updateAccount(
              account.id,
              {
                username: body.username,
                password: body.password,
                platform_id: body.platform,
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
          Edit Account
        </Button>
      </div>
    </form>
  );
};

export default EditAccountPage;
