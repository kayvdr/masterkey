import Footer from "../Footer";
import Header from "../Header";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { createAccount, getPlatforms } from "../../http/api";
import Button from "../ui/Button";
import ErrorText from "../ui/ErrorText";
import InputCheckBox from "../ui/InputCheckBox";
import InputField from "../ui/InputField";
import Page from "../ui/Page";
import Select from "../ui/Select";
import styles from "./Form.module.css";

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
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormUser>();

  if (!data) return null;

  return (
    <>
      <Header />
      <Page title="Share your Account with us!" titleCenter={true}>
        <div className={styles.formWrapper}>
          <h2>Please enter the following data.</h2>
          <form className={styles.form}>
            {error && <ErrorText text="An unknown error has occurred." />}
            <Select
              placeholder="Choose platform..."
              register={register("platform", {
                required: "Please choose a platform",
              })}
              options={data?.platforms}
              error={errors.platform}
            />
            <InputField
              placeholder="Username"
              register={register("username", {
                required: "Please insert a username",
              })}
              error={errors.username}
            />
            <InputField
              placeholder="Password"
              register={register("password", {
                required: "Please insert a password",
              })}
              error={errors.password}
            />
            <InputCheckBox
              register={register("privacy", {
                required: "Please accept the checkbox",
              })}
              error={errors.privacy}
              text="I agree that this data will be stored and further disseminated"
            />
            <div className={styles.field}>
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
