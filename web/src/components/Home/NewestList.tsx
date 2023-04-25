import { useNavigate } from "react-router-dom";
import Button from "../../ui/Button";
import Search from "../Search/Search";
import styles from "./NewestList.module.css";

const NewestList = () => {
  const navigate = useNavigate();

  return (
    <section className="container">
      <Search title="Just added" isPagination={false} sort="created_at" />
      <div className={styles.wrapper}>
        <Button onClick={() => navigate("/search")}>Show All</Button>
      </div>
    </section>
  );
};

export default NewestList;
