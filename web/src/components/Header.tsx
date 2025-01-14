import { Session } from "@supabase/supabase-js";
import { SupabaseAuthClient } from "@supabase/supabase-js/dist/module/lib/SupabaseAuthClient";
import classNames from "classnames";
import { useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useOnClickOutside } from "../hooks/useOnClickOutside";
import useToggle from "../hooks/useToggle";
import styles from "./Header.module.css";
import SvgAdd from "./icons/Add";
import SvgLogout from "./icons/Logout";
import Icon from "./ui/Icon";

const Header = () => {
  const { session, auth } = useAuth();

  return (
    <header className={styles.header}>
      <NavLink className={styles.logo} to="/">
        Masterkey
      </NavLink>
      {!session ? (
        <NavLink to="/login">Login</NavLink>
      ) : (
        <Account session={session} auth={auth} />
      )}
    </header>
  );
};

interface Props {
  session: Session | null;
  auth: SupabaseAuthClient;
}

const Account = ({ session, auth }: Props) => {
  const dropdown = useToggle();
  const wrapperRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(wrapperRef, dropdown.close);
  const navigate = useNavigate();

  return (
    <div className={styles.account} ref={wrapperRef}>
      <div className={styles.buttons}>
        <Link className={styles.addBtn} to="/add">
          <Icon glyph={SvgAdd} className={styles.addIcon} />
        </Link>
        <button
          className={classNames(styles.accountBtn, {
            [styles.accountBtnActive]: dropdown.isOpen,
          })}
          onClick={dropdown.toggle}
        >
          {session?.user.email?.charAt(0).toUpperCase()}
        </button>
      </div>
      {dropdown.isOpen && (
        <div className={styles.dropdown}>
          <NavLink className={styles.dropdownBtn} to="/profile">
            Profile
          </NavLink>
          <NavLink className={styles.dropdownBtn} to="/accounts">
            Your Accounts
          </NavLink>
          <NavLink className={styles.dropdownBtn} to="/votes">
            Your Votes
          </NavLink>
          <div className={styles.separator}></div>
          <button
            className={classNames(styles.dropdownBtn, styles.logout)}
            onClick={() => (auth.signOut(), navigate("/"))}
          >
            <Icon glyph={SvgLogout} className={styles.icon} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;
