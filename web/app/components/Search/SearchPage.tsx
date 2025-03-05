import Footer from "../Footer";
import Header from "../Header";
import Page from "../ui/Page";
import Searchfield from "../ui/Searchfield";
import Search from "./Search";

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
