import Container from "../Container";
import LinkButton from "../ui/LinkButton";
import styles from "./AddAccount.module.css";

const AddAccount = () => (
  <section className={styles.bg}>
    <Container className={styles.wrapper}>
      <h2 className={styles.title}>We need your help!</h2>
      <p>
        Our site lives on your willingness to share accounts with us. These
        should be accounts that you no longer necessarily use and it does not
        matter whether others use this now. Enter the data in the form and help
        us and others.
      </p>
      <div className={styles.btnWrapper}>
        <LinkButton to="/add">Share your Account</LinkButton>
      </div>
    </Container>
  </section>
);

export default AddAccount;
