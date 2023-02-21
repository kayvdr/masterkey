import { FormEvent, useEffect, useState } from "react";
import SvgSearch from "../components/icons/Search";
import Button from "./Button";
import Icon from "./Icon";
import styles from "./Searchfield.module.css";

interface Props {
  onSubmit: (value: string) => void;
}

const Searchfield = ({ onSubmit }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const searchParams = new URLSearchParams(location.search);

  useEffect(() => {
    const searchQuery = searchParams.get("q");
    searchQuery && setSearchTerm(searchQuery);
    searchQuery && onSubmit(searchQuery);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    onSubmit(searchTerm);
    searchParams.set("q", searchTerm);
    window.history.replaceState(
      {},
      "",
      `${location.pathname}?${searchParams.toString()}`
    );
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <Icon glyph={SvgSearch} className={styles.searchIcon} />
        <div className={styles.inputField}>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="search"
            placeholder="Instagram, Google ..."
            className={styles.input}
          />
        </div>
        <Button type="submit" className={styles.btn}>
          Search
        </Button>
      </div>
    </form>
  );
};

export default Searchfield;
