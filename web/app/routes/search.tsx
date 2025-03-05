import { MetaFunction } from "@remix-run/react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Search from "../components/Search/Search";
import Page from "../components/ui/Page";
import Searchfield from "../components/ui/Searchfield";

export const meta: MetaFunction = () => [
  { title: "Search Shared Accounts – Find Logins Fast" },
  {
    name: "description",
    content:
      "Looking for a shared account? Use our smart search to find logins for the platforms you need. Quick & easy access!",
  },
];

const SearchPage = () => (
  <>
    <Header />
    <Page>
      <Searchfield />
      <Search />
    </Page>
    <Footer />
  </>
);

export default SearchPage;
