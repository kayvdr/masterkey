import { MetaFunction } from "@remix-run/react";
import AccountList from "../components/Account/AccountList";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Page from "../components/ui/Page";
import { useAuth } from "../context/authContext";
import usePagination from "../hooks/usePagination";
import { getAccountsByCreatorId } from "../http/api";

export const meta: MetaFunction = () => [
  { title: "Your Accounts – Manage & Edit Your Shared Logins" },
  {
    name: "description",
    content:
      "View and manage all accounts you’ve shared on MasterKey. Edit details, update credentials, and keep your listings accurate.",
  },
];

const Accounts = () => {
  const { user } = useAuth();
  const pagination = usePagination();
  const { data, mutate } = getAccountsByCreatorId(user?.id, pagination.state);

  return (
    <>
      <Header />
      <Page title="Your Accounts">
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

export default Accounts;
