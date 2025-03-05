import classNames from "classnames";
import { useAuth } from "../../context/authContext";
import Container from "../Container";
import btnStyles from "../ui/Button.module.css";
import styles from "./AddAccount.module.css";

const AddAccount = () => {
  const { session } = useAuth();

  return (
    <section className={styles.bg}>
      <Container className={styles.wrapper}>
        <h2 className={styles.title}>We need your help!</h2>
        <p>
          Our site lives on your willingness to share accounts with us. These
          should be accounts that you no longer necessarily use and it does not
          matter whether others use this now. Enter the data in the form and
          help us and others.
        </p>
        <div className={styles.btnWrapper}>
          <a
            href={!session ? "/login" : "/add"}
            className={classNames(btnStyles.btn, btnStyles.primary)}
          >
            Share your Account
          </a>
        </div>
      </Container>
    </section>
  );
};

export default AddAccount;
