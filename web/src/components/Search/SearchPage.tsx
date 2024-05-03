import Footer from "../Footer";
import Header from "../Header";
import Page from "../ui/Page";
import Searchfield from "../ui/Searchfield";
import Search from "./Search";

const SearchPage = () => {
  return (
    <>
      <Header />
      <Page>
        <Searchfield />
        <Search />
      </Page>
      <Footer />
    </>
  );
};

export default SearchPage;
