import styles from "../AddAccount/AddAccountPage.module.css";
import Footer from "../Home/Footer";
import Header from "../Home/Header";
import AddForm from "./AddForm";

const AddAccountPage = () => {
  return (
    <>
      <Header />
      <section className={styles.sectionGrey}>
        <div className="container">
          <h1 className={styles.title}>Share your Account with us!</h1>
        </div>
      </section>
      <section className="container">
        <AddForm />
      </section>
      <Footer />
    </>
  );
};

export default AddAccountPage;
