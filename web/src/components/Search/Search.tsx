import classNames from "classnames";
import { useEffect } from "react";
import usePagination from "../../hooks/usePagination";
import { getAccounts } from "../../http/api";
import { Account } from "../../types";
import { getSearchParams, setSearchParams } from "../../utils";
import AccountList from "../Account/AccountList";
import styles from "./Search.module.css";

interface Props {
  title?: string;
  searchTerm?: string;
  isPagination?: boolean;
  sort?: keyof Account;
}

const isKeyofAccount = (value: string | null): value is keyof Account =>
  ["username", "votes_up", "votes_down", "created_at"].includes(
    value as keyof Account
  );

const Search = ({ title, searchTerm, isPagination = true, sort }: Props) => {
  const pagination = usePagination();

  const { data, isLoading, mutate } = getAccounts({
    q: searchTerm ?? "",
    ...pagination.state,
  });

  useEffect(() => {
    const querySort = getSearchParams("sort");

    !querySort && sort && pagination.setSort(sort);
    isKeyofAccount(querySort) && pagination.setSort(querySort);
  }, []);

  return (
    <>
      <div
        className={classNames(styles.searchRow, {
          [styles.searchRowRight]: !title,
        })}
      >
        {title && <h1 className={styles.rowTitle}>{title}</h1>}
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
      {data && (
        <AccountList
          accounts={data.accounts}
          total={data.total}
          pagination={pagination}
          isPagination={isPagination}
          isLoading={isLoading}
          mutate={mutate}
        />
      )}
    </>
  );
};

export default Search;
