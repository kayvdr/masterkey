import { useRef, useState } from "react";
import Searchfield from "../../ui/Searchfield";
import { RefType } from "../../ui/UserList";
import Footer from "../Footer";
import Header from "../Header";
import styles from "../Search/SearchPage.module.css";
import Search from "./Search";

const SearchPage = () => {
  const [value, setValue] = useState("");
  const userListRef = useRef<RefType>(null);

  return (
    <>
      <Header />
      <section className={styles.wrapper}>
        <div className="container">
          <Searchfield onSubmit={setValue} userListRef={userListRef} />
        </div>
      </section>
      <section className="container">
        <Search searchTerm={value} userListRef={userListRef} />
      </section>
      <Footer />
    </>
  );
};

export default SearchPage;
