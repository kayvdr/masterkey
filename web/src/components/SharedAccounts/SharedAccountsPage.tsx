import Footer from "../Footer";
import Header from "../Header";
import styles from "../SharedAccounts/SharedAccountsPage.module.css";

const SharedAccounts = () => {
  return (
    <>
      <Header />
      <section className={styles.sectionGrey}>
        <div className="container">
          <h1 className={styles.title}>Your Shared Accounts</h1>
        </div>
      </section>
      <section>
        <div className="container"></div>
      </section>
      <Footer />
    </>
  );
};

export default SharedAccounts;
