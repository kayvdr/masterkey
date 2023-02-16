import AddAccount from "./AddAccount";
import FavoritePlatforms from "./FavoritePlatforms";
import Footer from "./Footer";
import Header from "./Header";
import Intro from "./Intro";
import NewestList from "./NewestList";

const HomePage = () => (
  <>
    <Header />
    <Intro />
    <NewestList />
    <AddAccount />
    <FavoritePlatforms />
    <Footer />
  </>
);

export default HomePage;
