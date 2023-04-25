import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import Button from "../../ui/Button";
import styles from "./AddAccount.module.css";

const AddAccount = () => {
  const navigate = useNavigate();

  return (
    <section className={styles.bg}>
      <div className={classNames("container", styles.wrapper)}>
        <h2 className={styles.title}>We need your help!</h2>
        <p>
          Our site lives on your willingness to share accounts with us. These
          should be accounts that you no longer necessarily use and it does not
          matter whether others use this now. Enter the data in the form and
          help us and others.
        </p>
        <div className={styles.btnWrapper}>
          <Button onClick={() => navigate("/add")}>Share your Account</Button>
        </div>
      </div>
    </section>
  );
};

export default AddAccount;
