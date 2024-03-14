import { useLocation } from "react-router-dom";
import { Account } from "../../types";
import Footer from "../Footer";
import Header from "../Header";
import EditForm from "./EditForm";
import styles from "./Page.module.css";

const EditAccountPage = () => {
  const { state } = useLocation();

  const account: Account | undefined = state?.user
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
        {account && <EditForm account={account} />}
      </section>
      <Footer />
    </>
  );
};

export default EditAccountPage;
