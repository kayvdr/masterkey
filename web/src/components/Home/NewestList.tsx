import Container from "../Container";
import SvgList from "../icons/List";
import Search from "../Search/Search";
import Icon from "../ui/Icon";
import LinkButton from "../ui/LinkButton";
import styles from "./NewestList.module.css";

const NewestList = () => (
  <section>
    <Container>
      <Search isPagination={false} sort="created_at" />
      <div className={styles.wrapper}>
        <LinkButton to="/search">
          <Icon glyph={SvgList} className={styles.iconShowAll} /> Show All
        </LinkButton>
      </div>
    </Container>
  </section>
);

export default NewestList;
