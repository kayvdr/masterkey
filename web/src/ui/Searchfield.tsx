import { useEffect, useRef, useState } from "react";
import SvgClose from "../components/icons/Close";
import SvgSearch from "../components/icons/Search";
import { getSearchParams, setSearchParams } from "../utils";
import Button from "./Button";
import Icon from "./Icon";
import styles from "./Searchfield.module.css";

interface Props {
  onSubmit: (value: string) => void;
}

const Searchfield = ({ onSubmit }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const searchQuery = getSearchParams("q");
    searchQuery && setSearchTerm(searchQuery);
    searchQuery && onSubmit(searchQuery);
  }, []);

  return (
    <form className={styles.form}>
      <div className={styles.field}>
        <div className={styles.inputField}>
          <Icon glyph={SvgSearch} className={styles.searchIcon} />
          <input
            ref={inputRef}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="search"
            placeholder="Instagram, Google ..."
            className={styles.input}
          />
          {!!searchTerm.length && (
            <button
              className={styles.closeBtn}
              onClick={() => {
                setSearchTerm("");
                setSearchParams("q", "");
                inputRef.current?.focus();
              }}
            >
              <Icon glyph={SvgClose} className={styles.closeIcon} />
            </button>
          )}
        </div>
        <Button
          type="submit"
          onClick={() => {
            onSubmit(searchTerm);
            setSearchParams("q", searchTerm);
          }}
        >
          Search
        </Button>
      </div>
    </form>
  );
};

export default Searchfield;
