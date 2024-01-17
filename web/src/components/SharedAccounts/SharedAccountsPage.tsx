import { useContext, useEffect, useState } from "react";
import { getAccountsByCreatorId } from "../../http/api";
import { Account } from "../../types";
import UserList from "../../ui/UserList";
import { SessionContext } from "../AppRouter";
import Footer from "../Footer";
import Header from "../Header";
import styles from "../SharedAccounts/SharedAccountsPage.module.css";

const SharedAccounts = () => {
  const [users, setUsers] = useState<Account[]>();
  const session = useContext(SessionContext);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!session) return;
      const fetchedUsers = await getAccountsByCreatorId(session.user.id);
      fetchedUsers && setUsers(fetchedUsers.items);
    };

    fetchUsers();
  }, []);

  return (
    <>
      <Header />
      <section className={styles.sectionGrey}>
        <div className="container">
          <h1 className={styles.title}>Your Shared Accounts</h1>
        </div>
      </section>
      <section>
        <div className="container">
          {users && (
            <UserList users={users} setUsers={(data) => setUsers(data)} />
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default SharedAccounts;
