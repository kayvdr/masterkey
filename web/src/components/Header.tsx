import classNames from "classnames";
import { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../http/supabase";
import btnStyles from "../ui/Button.module.css";
import Icon from "../ui/Icon";
import { SessionContext } from "./AppRouter";
import styles from "./Header.module.css";
import SvgLogo from "./icons/Logo";
import SvgUser from "./icons/User";

const Header = () => {
  const navigate = useNavigate();
  const [navActive, setNavActive] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const session = useContext(SessionContext);

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
            className={classNames(styles.navToggle, {
              [styles.navToggleActive]: isOpen,
            })}
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className={styles.navToggleIcon}></span>
          </button>
        )}
        <nav
          className={classNames(styles.navbar, {
            [styles.navbarActive]: isOpen || !navActive,
          })}
        >
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

          {!session ? (
            <NavLink
              className={({ isActive }) =>
                classNames(btnStyles.btn, styles.navBtn, {
                  [styles.navActive]: isActive,
                })
              }
              to="/login"
            >
              Login
            </NavLink>
          ) : (
            <>
              <NavLink
                className={({ isActive }) =>
                  classNames(styles.navItem, { [styles.navActive]: isActive })
                }
                to="/dashboard"
              >
                Dashboard
              </NavLink>
              <div className={styles.account}>
                <button
                  className={styles.accountBtn}
                  onClick={() => setAccountOpen(!accountOpen)}
                >
                  <Icon glyph={SvgUser} className={styles.accountIcon} />
                </button>
                {accountOpen && (
                  <div className={styles.accountDropdown}>
                    <NavLink className={styles.dropdownBtn} to="/dashboard">
                      Profile
                    </NavLink>
                    <NavLink className={styles.dropdownBtn} to="/youraccounts">
                      Your Accounts
                    </NavLink>
                    <div className={styles.separator}></div>
                    <button
                      className={styles.dropdownBtn}
                      onClick={() => supabase.auth.signOut()}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
