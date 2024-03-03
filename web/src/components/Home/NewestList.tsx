import LinkButton from "../../ui/LinkButton";
import Search from "../Search/Search";
import styles from "./NewestList.module.css";

const NewestList = () => (
  <section className="container">
    <Search title="Just added" isPagination={false} sort="createdAt" />
    <div className={styles.wrapper}>
      <LinkButton to="/search">Show All</LinkButton>
    </div>
  </section>
);

export default NewestList;
