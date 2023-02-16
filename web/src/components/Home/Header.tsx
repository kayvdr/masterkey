import classNames from "classnames";
import { NavLink, useNavigate } from "react-router-dom";
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
        <NavLink
          className={({ isActive }) =>
            classNames(styles.navItem, { [styles.navActive]: isActive })
          }
          to="/"
        >
          Home
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            classNames(styles.navItem, { [styles.navActive]: isActive })
          }
          to="/search"
        >
          Search
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            classNames(styles.navItem, { [styles.navActive]: isActive })
          }
          to="/add"
        >
          Add Account
        </NavLink>
      </div>
    </header>
  );
};

export default Header;
