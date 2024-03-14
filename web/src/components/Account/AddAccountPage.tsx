import Footer from "../Footer";
import Header from "../Header";
import AddForm from "./AddForm";
import styles from "./Page.module.css";

const AddAccountPage = () => (
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

export default AddAccountPage;
