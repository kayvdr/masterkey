import imgUrl from "../../img/sunrise.jpg";
import Container from "../Container";
import Searchfield from "../ui/Searchfield";
import styles from "./Intro.module.css";

const Intro = () => (
  <section className={styles.intro}>
    <div className={styles.imgContainer}>
      <img src={imgUrl} className={styles.img} />
    </div>
    <Container className={styles.content}>
      <h1 className={styles.title}>Access for EVERYONE!</h1>
      <h2 className={styles.subtitle}>
        Accessing basic services shouldn't require registration. Protect your
        data from misuse.
      </h2>
      <div className={styles.searchWrapper}>
        <Searchfield />
      </div>
    </Container>
  </section>
);

export default Intro;
