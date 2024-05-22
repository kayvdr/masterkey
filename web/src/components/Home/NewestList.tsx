import Search from "../Search/Search";
import LinkButton from "../ui/LinkButton";
import styles from "./NewestList.module.css";

const NewestList = () => (
  <section className="container">
    <Search isPagination={false} sort="created_at" />
    <div className={styles.wrapper}>
      <LinkButton to="/search">Show All</LinkButton>
    </div>
  </section>
);

export default NewestList;
