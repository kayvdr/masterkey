import { type MetaFunction } from "@remix-run/node";
import Footer from "../components/Footer";
import Header from "../components/Header";
import AddAccount from "../components/Home/AddAccount";
import FavoritePlatforms from "../components/Home/FavoritePlatforms";
import Intro from "../components/Home/Intro";
import NewestList from "../components/Home/NewestList";

export const meta: MetaFunction = () => [
  { title: "MasterKey – Access Shared Accounts & Test Services Instantly" },
  {
    name: "description",
    content:
      "Discover and access shared accounts for various platforms. Test services instantly without signing up. Secure and community-driven!",
  },
];

const Index = () => (
  <>
    <Header />
    <Intro />
    <NewestList />
    <AddAccount />
    <FavoritePlatforms />
    <Footer />
  </>
);

export default Index;
