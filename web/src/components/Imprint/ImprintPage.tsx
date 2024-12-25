import Container from "../Container";
import Footer from "../Footer";
import Header from "../Header";
import styles from "./ImprintPage.module.css";

const ImprintPage = () => (
  <>
    <Header />
    <section className={styles.wrapper}>
      <Container>
        <h1 className={styles.title}>Imprint</h1>
        <p>comming soon...</p>
      </Container>
    </section>
    <Footer />
  </>
);

export default ImprintPage;
