import classNames from "classnames";
import { PropsWithChildren, useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "../../context/authContext";
import NotificationContext, {
  showErrorNotification,
  showSuccessNotification,
} from "../../context/notificationContext";
import useToggle from "../../hooks/useToggle";
import { deleteUserRequest } from "../../http/api";
import inputStyles from "../Account/Form.module.css";
import Footer from "../Footer";
import Header from "../Header";
import Button from "../ui/Button";
import Page from "../ui/Page";
import styles from "./Profile.module.css";

interface FormUser {
  email: string;
}

const Profile = () => {
  const { session, user, auth } = useAuth();
  const modal = {
    email: useToggle(),
    password: useToggle(),
    delete: useToggle(),
  };
  const [loading, setLoading] = useState({
    password: false,
    delete: false,
  });
  const dispatch = useContext(NotificationContext);

  const closeAllModal = () => {
    modal.email.close();
    modal.password.close();
    modal.delete.close();
  };

  const {
    reset,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormUser>({ defaultValues: { email: "" } });

  return (
    <>
      <Header />
      <Page title="Profile">
        <Item
          label="E-Mail Address"
          value={user?.email ?? ""}
          openValue="Enter your new E-Mail Address"
          modal={modal.email}
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
                const { error } = await auth.updateUser({
                  email: body.email,
                });

                if (error) {
                  dispatch(showErrorNotification(error.message));
                  return;
                }

                dispatch(showSuccessNotification("Email send successfully"));
                reset();
                modal.email.close();
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
          modal={modal.password}
          closeAllModal={closeAllModal}
        >
          <Button
            isLoading={loading.password}
            onClick={async () => {
              setLoading({ ...loading, password: true });
              const email = user?.email;
              if (!email) return;

              const { error } = await auth.resetPasswordForEmail(email);

              if (error) {
                dispatch(showErrorNotification(error.message));
                setLoading({ ...loading, delete: false });
                return;
              }

              dispatch(showSuccessNotification("Email send successfully"));
              setLoading({ ...loading, password: false });
              modal.password.close();
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
          modal={modal.delete}
          closeAllModal={closeAllModal}
        >
          <Button
            isLoading={loading.delete}
            onClick={async () => {
              setLoading({ ...loading, delete: true });
              const id = user?.id;
              if (!id || !session) return;

              deleteUserRequest({ user_id: id }, session.access_token)
                .then(() => {
                  dispatch(showSuccessNotification("Deleted successfully"));
                })
                .catch((error) => {
                  dispatch(showErrorNotification(error.message));
                })
                .finally(() => {
                  setLoading({ ...loading, delete: false });
                  modal.delete.close();
                });
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
