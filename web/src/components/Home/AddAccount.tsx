import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import Button from "../../ui/Button";
import styles from "../Home/AddAccount.module.css";

const AddAccount = () => {
  const navigate = useNavigate();

  return (
    <section className={styles.bg}>
      <div className={classNames("container", styles.wrapper)}>
        <h2 className={styles.title}>We need your help!</h2>
        <p>
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
          nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
          sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
          rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem
          ipsum dolor sit amet.
        </p>
        <div className={styles.btnWrapper}>
          <Button onClick={() => navigate("/add")}>Share your Account</Button>
        </div>
      </div>
    </section>
  );
};

export default AddAccount;
