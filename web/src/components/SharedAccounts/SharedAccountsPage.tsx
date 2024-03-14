import { useContext } from "react";
import { getAccountsByCreatorId } from "../../http/api";
import AccountList from "../Account/AccountList";
import { SessionContext } from "../AppRouter";
import Footer from "../Footer";
import Header from "../Header";
import styles from "../SharedAccounts/SharedAccountsPage.module.css";

const SharedAccounts = () => {
  const session = useContext(SessionContext);
  const { data, mutate } = getAccountsByCreatorId(session?.user.id);

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
          {data?.accounts && (
            <AccountList accounts={data.accounts} mutate={mutate} />
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default SharedAccounts;
