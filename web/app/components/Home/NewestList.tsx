import classNames from "classnames";
import Container from "../Container";
import SvgList from "../icons/List";
import Search from "../Search/Search";
import btnStyles from "../ui/Button.module.css";
import Icon from "../ui/Icon";
import styles from "./NewestList.module.css";

const NewestList = () => (
  <section>
    <Container>
      <Search isPagination={false} sort="created_at" />
      <div className={styles.wrapper}>
        <a
          href="/search"
          className={classNames(btnStyles.btn, btnStyles.primary)}
        >
          <Icon glyph={SvgList} className={styles.iconShowAll} /> Show All
        </a>
      </div>
    </Container>
  </section>
);

export default NewestList;
