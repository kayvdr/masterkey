import { Session } from "@supabase/supabase-js";
import { useContext, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useOnClickOutside } from "../hooks/useOnClickOutside";
import useToggle from "../hooks/useToggle";
import { supabase } from "../http/supabase";
import { SessionContext } from "./AppRouter";
import styles from "./Header.module.css";

const Header = () => {
  const session = useContext(SessionContext);

  return (
    <header className={styles.header}>
      <NavLink className={styles.logo} to="/">
        Shac
      </NavLink>
      {!session ? (
        <NavLink className={styles.btn} to="/login">
          Login
        </NavLink>
      ) : (
        <Account session={session} />
      )}
    </header>
  );
};

interface Props {
  session: Session | null;
}

const Account = ({ session }: Props) => {
  const dropdown = useToggle();
  const wrapperRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(wrapperRef, dropdown.close);
  const navigate = useNavigate();

  return (
    <div className={styles.account} ref={wrapperRef}>
      <button className={styles.accountBtn} onClick={dropdown.toggle}>
        {session?.user.email?.charAt(0).toUpperCase()}
      </button>
      {dropdown.isOpen && (
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
            onClick={() => (supabase.auth.signOut(), navigate("/"))}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;
