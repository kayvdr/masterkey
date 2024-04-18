import { useAuth } from "../../context/authContext";
import usePagination from "../../hooks/usePagination";
import { getVotesByCreatorId } from "../../http/api";
import AccountList from "../Account/AccountList";
import Footer from "../Footer";
import Header from "../Header";
import styles from "./VotesPage.module.css";

const Votes = () => {
  const { user } = useAuth();
  const pagination = usePagination();
  const { data, isLoading, mutate } = getVotesByCreatorId(
    user?.id,
    pagination.state
  );

  return (
    <>
      <Header />
      <section className={styles.paddingTop}>
        <div className="container">
          <h1 className={styles.title}>Your Votes</h1>
          {data && (
            <AccountList
              accounts={data.accounts}
              total={data.total}
              pagination={pagination}
              isLoading={isLoading}
              mutate={mutate}
            />
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Votes;
