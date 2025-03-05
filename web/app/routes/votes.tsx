import { MetaFunction } from "@remix-run/react";
import AccountList from "../components/Account/AccountList";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Page from "../components/ui/Page";
import { useAuth } from "../context/authContext";
import usePagination from "../hooks/usePagination";
import { getVotesByCreatorId } from "../http/api";

export const meta: MetaFunction = () => [
  { title: "Your Votes – Track & Manage Your Account Ratings" },
  {
    name: "description",
    content:
      "View and manage the accounts you’ve voted for. Keep track of your contributions and ensure the best quality for the community.",
  },
];

const VotesPage = () => {
  const { user } = useAuth();
  const pagination = usePagination();
  const { data, mutate } = getVotesByCreatorId(user?.id, pagination.state);

  if (!data) return null;

  return (
    <>
      <Header />
      <Page title="Your Votes">
        {data && (
          <AccountList
            accounts={data.accounts}
            total={data.total}
            pagination={pagination}
            mutate={mutate}
          />
        )}
      </Page>
      <Footer />
    </>
  );
};

export default VotesPage;
