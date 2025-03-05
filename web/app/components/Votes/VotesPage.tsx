import { useAuth } from "../../context/authContext";
import usePagination from "../../hooks/usePagination";
import { getVotesByCreatorId } from "../../http/api";
import AccountList from "../Account/AccountList";
import Footer from "../Footer";
import Header from "../Header";
import Page from "../ui/Page";

const VotesPage = () => {
  const { user } = useAuth();
  const pagination = usePagination();
  const { data, mutate } = getVotesByCreatorId(user?.id, pagination.state);

  if (!data) return null;

  return (
    <>
      <Header />
      <Page title="Your Votes">
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

export default VotesPage;
