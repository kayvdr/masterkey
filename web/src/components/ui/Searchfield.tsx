import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { getSearchParams } from "../../utils";
import SvgClose from "../icons/Close";
import SvgSearch from "../icons/Search";
import Button from "./Button";
import Icon from "./Icon";
import styles from "./Searchfield.module.css";

const Searchfield = () => {
  const navigate = useNavigate();
  const { search } = useLocation();

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { dirtyFields },
  } = useForm<{ query: string }>({
    values: { query: getSearchParams(search, "q") ?? "" },
  });

  return (
    <form className={styles.form}>
      <div className={styles.field}>
        <div className={styles.inputField}>
          <Icon glyph={SvgSearch} className={styles.searchIcon} />
          <input
            type="search"
            placeholder="Instagram, Google ..."
            className={styles.input}
            autoComplete="off"
            spellCheck="false"
            {...register("query")}
          />
          {(dirtyFields.query || getValues("query")) && (
            <button
              type="button"
              className={styles.closeBtn}
              onClick={() => reset({ query: "" })}
            >
              <Icon glyph={SvgClose} className={styles.closeIcon} />
            </button>
          )}
        </div>
        <Button
          type="submit"
          onClick={handleSubmit((body) =>
            navigate({ pathname: "/search", search: `?q=${body.query}` })
          )}
        >
          Search
        </Button>
      </div>
    </form>
  );
};

export default Searchfield;
