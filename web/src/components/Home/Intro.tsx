import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import Searchfield from "../../ui/Searchfield";
import styles from "../Home/Intro.module.css";

const Intro = () => {
  const navigate = useNavigate();

  return (
    <section className={styles.intro}>
      <div className={styles.imgContainer}>
        <img
          src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/84887be9-3a7a-4ce4-ab23-23239b7dcf73/daw2he3-cca23219-7795-4737-814b-21d098f31ac5.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzg0ODg3YmU5LTNhN2EtNGNlNC1hYjIzLTIzMjM5YjdkY2Y3M1wvZGF3MmhlMy1jY2EyMzIxOS03Nzk1LTQ3MzctODE0Yi0yMWQwOThmMzFhYzUuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.dnYm2rXPZBsy3Vrfr-aCrJzRHcfIs2dkv_p5oV2u1eY"
          className={styles.img}
        />
      </div>
      <div className={classNames("container", styles.content)}>
        <h1 className={styles.title}>
          Access for <span>Everyone</span>
        </h1>
        <h2>
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
          nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
          sed diam voluptua.
        </h2>
        <div className={styles.searchWrapper}>
          <Searchfield onSubmit={(value) => navigate(`/search?q=${value}`)} />
        </div>
      </div>
    </section>
  );
};

export default Intro;
