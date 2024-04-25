import classNames from "classnames";
import { useEffect } from "react";
import usePagination from "../../hooks/usePagination";
import { getAccounts } from "../../http/api";
import { Account } from "../../types";
import {
  getRemoteDataStatus,
  getSearchParams,
  setSearchParams,
} from "../../utils";
import AccountList from "../Account/AccountList";
import ErrorPage from "../Error/ErrorPage";
import { Loading } from "../ui/Loading";
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

  const { data, isValidating, error, mutate } = getAccounts({
    q: searchTerm ?? "",
    ...pagination.state,
  });
  const status = getRemoteDataStatus({ isValidating, error });

  useEffect(() => {
    const querySort = getSearchParams("sort");

    !querySort && sort && pagination.setSort(sort);
    isKeyofAccount(querySort) && pagination.setSort(querySort);
  }, []);

  return (
    <>
      {status === "success" && data && (
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
          <AccountList
            accounts={data.accounts}
            total={data.total}
            pagination={pagination}
            isPagination={isPagination}
            mutate={mutate}
          />
        </>
      )}

      {status === "validating" && <Loading />}

      {status === "failure" && (
        <ErrorPage title="Fehler beim Laden der Daten." />
      )}
    </>
  );
};

export default Search;
