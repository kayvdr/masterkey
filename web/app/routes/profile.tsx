import { MetaFunction } from "@remix-run/react";
import { PropsWithChildren, useContext, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ChangeEmail from "../components/Profile/ChangeEmail";
import ChangePassword from "../components/Profile/ChangePassword";
import styles from "../components/Profile/Profile.module.css";
import Button from "../components/ui/Button";
import Page from "../components/ui/Page";
import { useAuth } from "../context/authContext";
import NotificationContext, {
  showErrorNotification,
  showSuccessNotification,
} from "../context/notificationContext";
import useToggle from "../hooks/useToggle";
import { deleteUserRequest } from "../http/api";

export const meta: MetaFunction = () => [
  { title: "Your Profile – Manage Your MasterKey Account" },
  {
    name: "description",
    content:
      "Edit your profile, manage your shared accounts, and customize your settings in your MasterKey dashboard.",
  },
];

const Profile = () => {
  const { session, user } = useAuth();
  const modal = {
    email: useToggle(),
    password: useToggle(),
    delete: useToggle(),
  };
  const [loading, setLoading] = useState({
    delete: false,
  });
  const dispatch = useContext(NotificationContext);

  const closeAllModal = () => {
    modal.email.close();
    modal.password.close();
    modal.delete.close();
  };

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
          <ChangeEmail onClose={modal.email.close} />
        </Item>
        <Item
          label="Password"
          value="**********"
          openValue="Enter your new Password"
          editBtnLabel="Change"
          modal={modal.password}
          closeAllModal={closeAllModal}
        >
          <ChangePassword onClose={modal.password.close} />
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
                  dispatch(
                    showSuccessNotification("Deletion requested successfully")
                  );
                })
                .catch((error) =>
                  dispatch(showErrorNotification(error.message))
                )
                .finally(() => {
                  setLoading({ ...loading, delete: false });
                  modal.delete.close();
                });
            }}
          >
            Request deletion
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
