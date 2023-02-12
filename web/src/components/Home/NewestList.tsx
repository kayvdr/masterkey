import { useNavigate } from "react-router-dom";
import Button from "../../ui/Button";
import styles from "../Home/NewstList.module.css";
import Search from "../Search/Search";

const NewestList = () => {
  const navigate = useNavigate();

  return (
    <section className="container">
      <div className={styles.search}>
        <Search title="Just added" searchTerm={""} />
      </div>
      <div className={styles.wrapper}>
        <Button onClick={() => navigate("/search")}>Show All</Button>
      </div>
    </section>
  );
};

export default NewestList;
