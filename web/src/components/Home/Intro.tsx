import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import Searchfield from "../../ui/Searchfield";
import styles from "./Intro.module.css";
// @ts-ignore
import imgUrl from "../../img/sunrise.jpg";

const Intro = () => {
  const navigate = useNavigate();

  return (
    <section className={styles.intro}>
      <div className={styles.imgContainer}>
        <img src={imgUrl} className={styles.img} />
      </div>
      <div className={classNames("container", styles.content)}>
        <h1 className={styles.title}>
          Access for <span>Everyone</span>
        </h1>
        <h2 className={styles.subtitle}>
          It should not be necessary to register with every website in order to
          use their basic services. Because not everyone can handle your data
          responsibly, you need to protect yourself.
        </h2>
        <div className={styles.searchWrapper}>
          <Searchfield onSubmit={(value) => navigate(`/search?q=${value}`)} />
        </div>
      </div>
    </section>
  );
};

export default Intro;
