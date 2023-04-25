import { useLocation } from "react-router-dom";
import { User } from "../../types";
import styles from "../Account/AccountPage.module.css";
import Footer from "../Footer";
import Header from "../Header";
import AddForm from "./AccountForm";

const EditAccountPage = () => {
  const { state } = useLocation();

  const user: User | undefined = state?.user
    ? JSON.parse(state?.user)
    : undefined;

  return (
    <>
      <Header />
      <section className={styles.sectionGrey}>
        <div className="container">
          <h1 className={styles.title}>Edit your shared Account!</h1>
        </div>
      </section>
      <section className="container">
        <AddForm user={user} />
      </section>
      <Footer />
    </>
  );
};

export default EditAccountPage;
