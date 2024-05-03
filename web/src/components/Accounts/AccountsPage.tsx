import { useAuth } from "../../context/authContext";
import usePagination from "../../hooks/usePagination";
import { getAccountsByCreatorId } from "../../http/api";
import AccountList from "../Account/AccountList";
import Footer from "../Footer";
import Header from "../Header";
import Page from "../ui/Page";

const Accounts = () => {
  const { user } = useAuth();
  const pagination = usePagination();
  const { data, mutate } = getAccountsByCreatorId(user?.id, pagination.state);

  if (!data) return null;

  return (
    <>
      <Header />
      <Page title="Your Accounts">
        <AccountList
          accounts={data.accounts}
          total={data.total}
          pagination={pagination}
          mutate={mutate}
        />
      </Page>
      <Footer />
    </>
  );
};

export default Accounts;
