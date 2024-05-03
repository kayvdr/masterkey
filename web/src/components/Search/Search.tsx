import classNames from "classnames";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import usePagination from "../../hooks/usePagination";
import { getAccounts } from "../../http/api";
import { Account } from "../../types";
import { getSearchParams, setSearchParams } from "../../utils";
import AccountList from "../Account/AccountList";
import styles from "./Search.module.css";

interface Props {
  isPagination?: boolean;
  sort?: keyof Account;
}

const isKeyofAccount = (value: string | null): value is keyof Account =>
  ["username", "votes_up", "votes_down", "created_at"].includes(
    value as keyof Account
  );

const Search = ({ isPagination = true, sort }: Props) => {
  const pagination = usePagination();

  const { search } = useLocation();
  const { data, mutate } = getAccounts({
    q: getSearchParams(search, "q") ?? "",
    ...pagination.state,
  });

  useEffect(() => {
    const querySort = getSearchParams(search, "sort");

    !querySort && sort && pagination.setSort(sort);
    isKeyofAccount(querySort) && pagination.setSort(querySort);
  }, []);

  if (!data) return null;

  return (
    <>
      <div className={styles.searchRow}>
        <div className={styles.filter}>
          <select
            value={pagination.state.sort ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              if (!isKeyofAccount(value) || sort) return;
              pagination.setSort(value);
              setSearchParams("sort", value);
            }}
            className={classNames(styles.sortSelect, {
              [styles.selectActive]: !!pagination.state.sort,
            })}
            disabled={!!sort}
          >
            <option value="" disabled={true}>
              Sort ...
            </option>
            <option value="created_at">Newest</option>
            <option value="username">Username</option>
            <option value="votes_up">Vote up</option>
            <option value="votes_down">Vote down</option>
          </select>
        </div>
      </div>
      <AccountList
        accounts={data.accounts}
        total={data.total}
        pagination={pagination}
        isPagination={isPagination}
        mutate={mutate}
      />
    </>
  );
};

export default Search;
