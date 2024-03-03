import { useState } from "react";
import Searchfield from "../../ui/Searchfield";
import Footer from "../Footer";
import Header from "../Header";
import styles from "../Search/SearchPage.module.css";
import Search from "./Search";

const SearchPage = () => {
  const [value, setValue] = useState("");

  return (
    <>
      <Header />
      <section className={styles.wrapper}>
        <div className="container">
          <Searchfield onSubmit={setValue} />
        </div>
      </section>
      <section>
        <div className="container">
          <Search searchTerm={value} />
        </div>
      </section>
      <Footer />
    </>
  );
};

export default SearchPage;
