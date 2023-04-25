import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import Button from "../../ui/Button";
import Footer from "../Footer";
import Header from "../Header";
import styles from "./NotFoundPage.module.css";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <section className={styles.sectionGrey}>
        <div className="container">
          <h1 className={styles.title}>Error 404</h1>
        </div>
      </section>
      <section className={classNames("container", styles.wrapper)}>
        <p>The Page was not found</p>
        <Button onClick={() => navigate("/")}>Back to Home</Button>
      </section>
      <Footer />
    </>
  );
};

export default NotFoundPage;
