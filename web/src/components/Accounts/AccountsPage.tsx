import { useContext } from "react";
import { getAccountsByCreatorId } from "../../http/api";
import AccountList from "../Account/AccountList";
import { SessionContext } from "../AppRouter";
import Footer from "../Footer";
import Header from "../Header";
import styles from "./AccountsPage.module.css";

const Accounts = () => {
  const session = useContext(SessionContext);
  const { data, mutate } = getAccountsByCreatorId(session?.user.id);

  return (
    <>
      <Header />
      <section className={styles.paddingTop}>
        <div className="container">
          <h1 className={styles.title}>Your Accounts</h1>
          {data?.accounts && (
            <AccountList accounts={data.accounts} mutate={mutate} />
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Accounts;
