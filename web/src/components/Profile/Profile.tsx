import classNames from "classnames";
import { PropsWithChildren, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "../../context/authContext";
import useToggle from "../../hooks/useToggle";
import inputStyles from "../Account/Form.module.css";
import Footer from "../Footer";
import Header from "../Header";
import Button from "../ui/Button";
import ErrorText from "../ui/ErrorText";
import Page from "../ui/Page";
import styles from "./Profile.module.css";

interface FormUser {
  email: string;
}

const Profile = () => {
  const { user, auth } = useAuth();
  const emailModal = useToggle();
  const passworModal = useToggle();
  const deleteModal = useToggle();
  const [error, setError] = useState(false);

  const closeAllModal = () => {
    emailModal.close();
    passworModal.close();
    deleteModal.close();
  };

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormUser>({ defaultValues: { email: "" } });

  return (
    <>
      <Header />
      <Page title="Profile">
        {error && <ErrorText text="An unknown error has occurred." />}
        <Item
          label="E-Mail Address"
          value={user?.email ?? ""}
          openValue="Enter your new E-Mail Address"
          modal={emailModal}
          closeAllModal={closeAllModal}
        >
          <form>
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
            <Button
              type="submit"
              isLoading={isSubmitting}
              onClick={handleSubmit(async (body) => {
                setError(false);
                const { error } = await auth.updateUser({
                  email: body.email,
                });

                error ? setError(true) : passworModal.close();
              })}
            >
              Save
            </Button>
          </form>
        </Item>
        <Item
          label="Password"
          value="**********"
          openValue="You need to get a Password Reset Email?"
          editBtnLabel="Change"
          modal={passworModal}
          closeAllModal={closeAllModal}
        >
          <Button
            onClick={async () => {
              const email = user?.email;
              if (!email) return;

              const { error } = await auth.resetPasswordForEmail(email);
              error ? setError(true) : deleteModal.close();
            }}
          >
            Send
          </Button>
        </Item>
        <Item
          label="Delete Account"
          value="All your Data"
          openValue="Are you sure you want to delete your profile?"
          editBtnLabel="Delete"
          modal={deleteModal}
          closeAllModal={closeAllModal}
        >
          <Button
            onClick={async () => {
              const id = user?.id;
              if (!id) return;

              const { error } = await auth.admin.deleteUser(id);
              error ? setError(true) : deleteModal.close();
            }}
          >
            Delete Permanently
          </Button>
        </Item>
      </Page>
      <Footer />
    </>
  );
};

type ItemProps = PropsWithChildren<{
  label: string;
  value: string;
  openValue: string;
  modal: {
    isOpen: boolean;
    close: () => void;
    open: () => void;
    toggle: () => void;
  };
  editBtnLabel?: string;
  closeAllModal: () => void;
}>;

const Item = ({
  label,
  value,
  openValue,
  modal,
  editBtnLabel = "Edit",
  closeAllModal,
  children,
}: ItemProps) => (
  <div className={styles.item}>
    <div className={styles.labelRow}>
      <p className={styles.label}>{label}</p>
      {!modal.isOpen ? (
        <button
          className={styles.btn}
          onClick={() => (closeAllModal(), modal.open())}
        >
          {editBtnLabel}
        </button>
      ) : (
        <button className={styles.btn} onClick={modal.close}>
          Cancel
        </button>
      )}
    </div>
    <div>
      {!modal.isOpen ? (
        <p className={styles.value}>{value}</p>
      ) : (
        <>
          <p className={styles.value}>{openValue}</p>
          <div className={styles.modalWrapper}>{children}</div>
        </>
      )}
    </div>
  </div>
);

export default Profile;
