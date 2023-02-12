import { useNavigate } from "react-router-dom";
import Icon from "../../ui/Icon";
import styles from "../Home/Header.module.css";
import SvgLogo from "../icons/Logo";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <button className={styles.logo} onClick={() => navigate("/")}>
        <Icon glyph={SvgLogo} className={styles.logo} />
      </button>
      <div className={styles.nav}>
        <button onClick={() => navigate("/")} className={styles.navItem}>
          Home
        </button>
        <button onClick={() => navigate("/")} className={styles.navItem}>
          Search
        </button>
        <button onClick={() => navigate("/")} className={styles.navItem}>
          Imprint
        </button>
      </div>
    </header>
  );
};

export default Header;
