import Container from "../Container";
import Footer from "../Footer";
import Header from "../Header";
import styles from "./PrivacyPage.module.css";

const PrivacyPage = () => (
  <>
    <Header />
    <section className={styles.wrapper}>
      <Container>
        <h1 className={styles.title}>Privacy</h1>
        <p>comming soon...</p>
      </Container>
    </section>
    <Footer />
  </>
);

export default PrivacyPage;
