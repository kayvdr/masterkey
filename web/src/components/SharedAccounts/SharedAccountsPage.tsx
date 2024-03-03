import { useContext, useEffect, useState } from "react";
import { getAccountsByCreatorId } from "../../http/api";
import { Account } from "../../types";
import AccountList from "../../ui/AccountList";
import { SessionContext } from "../AppRouter";
import Footer from "../Footer";
import Header from "../Header";
import styles from "../SharedAccounts/SharedAccountsPage.module.css";

const SharedAccounts = () => {
  const [accounts, setAccounts] = useState<Account[]>();
  const session = useContext(SessionContext);

  useEffect(() => {
    const fetchAccounts = async () => {
      if (!session) return;
      const fetchedUsers = await getAccountsByCreatorId(session.user.id);
      fetchedUsers && setAccounts(fetchedUsers.items);
    };

    fetchAccounts();
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
          {accounts && (
            <AccountList accounts={accounts} setAccounts={setAccounts} />
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default SharedAccounts;
