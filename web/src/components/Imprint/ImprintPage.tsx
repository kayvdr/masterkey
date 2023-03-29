import Footer from "../Footer";
import Header from "../Header";
import styles from "../Imprint/ImprintPage.module.css";

const ImprintPage = () => (
  <>
    <Header />
    <section className={styles.wrapper}>
      <div className="container">
        <h1 className={styles.title}>Imprint</h1>
        <p>comming soon...</p>
      </div>
    </section>
    <Footer />
  </>
);

export default ImprintPage;
