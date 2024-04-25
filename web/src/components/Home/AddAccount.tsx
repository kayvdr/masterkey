import classNames from "classnames";
import LinkButton from "../ui/LinkButton";
import styles from "./AddAccount.module.css";

const AddAccount = () => (
  <section className={styles.bg}>
    <div className={classNames("container", styles.wrapper)}>
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
    </div>
  </section>
);

export default AddAccount;
