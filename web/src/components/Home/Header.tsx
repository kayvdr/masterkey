import classNames from "classnames";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Icon from "../../ui/Icon";
import styles from "../Home/Header.module.css";
import SvgLogo from "../icons/Logo";

const Header = () => {
  const navigate = useNavigate();
  const [navActive, setNavActive] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setNavActive(document.body.clientWidth < 992);
  }, []);

  return (
    <header className={styles.header}>
      <button className={styles.logo} onClick={() => navigate("/")}>
        <Icon glyph={SvgLogo} className={styles.logo} />
      </button>
      <div className={styles.nav}>
        {navActive && (
          <button
            className={classNames(styles.navBtn, {
              [styles.navBtnActive]: isOpen,
            })}
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className={styles.navBtnIcon}></span>
          </button>
        )}
        <div
          className={classNames(styles.navbar, {
            [styles.navbarActive]: isOpen || !navActive,
          })}
        >
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
      </div>
    </header>
  );
};

export default Header;
