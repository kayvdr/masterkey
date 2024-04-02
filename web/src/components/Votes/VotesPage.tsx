import { useContext } from "react";
import { getVotesByCreatorId } from "../../http/api";
import AccountList from "../Account/AccountList";
import { SessionContext } from "../AppRouter";
import Footer from "../Footer";
import Header from "../Header";
import styles from "./VotesPage.module.css";

const Votes = () => {
  const session = useContext(SessionContext);
  const { data, mutate } = getVotesByCreatorId(session?.user.id);

  return (
    <>
      <Header />
      <section className={styles.paddingTop}>
        <div className="container">
          <h1 className={styles.title}>Your Votes</h1>
          {data?.accounts && (
            <AccountList accounts={data.accounts} mutate={mutate} />
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Votes;
