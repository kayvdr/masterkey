import { useAuth } from "../../context/authContext";
import usePagination from "../../hooks/usePagination";
import { getAccountsByCreatorId } from "../../http/api";
import { getRemoteDataStatus } from "../../utils";
import AccountList from "../Account/AccountList";
import ErrorPage from "../Error/ErrorPage";
import Footer from "../Footer";
import Header from "../Header";
import { Loading } from "../ui/Loading";
import styles from "./AccountsPage.module.css";

const Accounts = () => {
  const { user } = useAuth();
  const pagination = usePagination();
  const { data, isLoading, isValidating, error, mutate } =
    getAccountsByCreatorId(user?.id, pagination.state);
  const status = getRemoteDataStatus({ isValidating, error });

  return (
    <>
      <Header />
      {status === "success" && (
        <section className={styles.paddingTop}>
          <div className="container">
            <h1 className={styles.title}>Your Accounts</h1>
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
      )}

      {status === "validating" && <Loading />}

      {status === "failure" && (
        <ErrorPage title="Fehler beim Laden der Daten." />
      )}

      <Footer />
    </>
  );
};

export default Accounts;
