import { Session } from "@supabase/supabase-js";
import { SupabaseAuthClient } from "@supabase/supabase-js/dist/module/lib/SupabaseAuthClient";
import classNames from "classnames";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useOnClickOutside } from "../hooks/useOnClickOutside";
import useToggle from "../hooks/useToggle";
import styles from "./Header.module.css";
import SvgAdd from "./icons/Add";
import SvgLogo from "./icons/Logo";
import SvgLogout from "./icons/Logout";
import Icon from "./ui/Icon";

const Header = () => {
  const { session, auth } = useAuth();

  return (
    <header className={styles.header}>
      <a href="/" className={styles.logo}>
        <Icon glyph={SvgLogo} className={styles.logoIcon} />
        Masterkey
      </a>
      {!session ? (
        <a href="/login">Login</a>
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
        <a href="/add" className={styles.addBtn}>
          <Icon glyph={SvgAdd} className={styles.addIcon} />
        </a>
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
          <a href="/profile" className={styles.dropdownBtn}>
            Profile
          </a>
          <a href="/accounts" className={styles.dropdownBtn}>
            Your Accounts
          </a>
          <a href="/votes" className={styles.dropdownBtn}>
            Your Votes
          </a>
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
