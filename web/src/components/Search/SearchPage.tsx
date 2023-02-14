import { useState } from "react";
import Searchfield from "../../ui/Searchfield";
import Footer from "../Home/Footer";
import Header from "../Home/Header";
import styles from "../Search/SearchPage.module.css";
import Search from "./Search";

const SearchPage = () => {
  const [value, setValue] = useState("");

  return (
    <>
      <Header />
      <section className={styles.searchFieldWrapper}>
        <div className="container">
          <Searchfield onSubmit={setValue} />
        </div>
      </section>
      <section className="container">
        <Search title="&nbsp;" searchTerm={value} />
      </section>
      <Footer />
    </>
  );
};

export default SearchPage;
