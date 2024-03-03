import classNames from "classnames";
import { useEffect } from "react";
import useListFilters from "../../hooks/useListFilters";
import { getAccounts } from "../../http/api";
import { Account } from "../../types";
import AccountList from "../../ui/AccountList";
import { getSearchParams, setSearchParams } from "../../utils";
import SvgArrowLeft from "../icons/ArrowLeft";
import SvgArrowRight from "../icons/ArrowRight";
import styles from "./Search.module.css";

interface Props {
  title?: string;
  searchTerm?: string;
  isPagination?: boolean;
  sort?: keyof Account;
}

const isKeyofAccount = (value: string): value is keyof Account =>
  [
    "id",
    "username",
    "password",
    "platform_id",
    "votes_up",
    "votes_down",
    "created_at",
  ].includes(value as keyof Account);

const Search = ({ title, searchTerm, isPagination = true, sort }: Props) => {
  const filters = useListFilters();

  const {
    data: accounts,
    isLoading,
    mutate,
  } = getAccounts({
    q: searchTerm ?? "",
    order: filters.state.sort === "username" ? "ASC" : "DESC",
    ...filters.state,
  });

  useEffect(() => {
    const searchQuery = getSearchParams("sort");
    if (!searchQuery || sort) return;

    isKeyofAccount(searchQuery) && filters.setSort(searchQuery);
  }, []);

  const pages =
    accounts?.count && Math.ceil(accounts.count / filters.state.limit);

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
            value={filters.state.sort ?? ""}
            onChange={(e) => {
              const value = e.target.value as keyof Account;
              if (!isKeyofAccount(value) || sort) return;
              filters.setSort(value);
              setSearchParams("sort", value);
            }}
            className={classNames(styles.sortSelect, {
              [styles.selectActive]: !!filters.state.sort,
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
      {accounts && (
        <>
          {isLoading && <p>ladet</p>}
          {accounts.count === 0 && !isLoading && <div>No Accounts found</div>}
          <AccountList accounts={accounts.items} mutate={mutate} />
        </>
      )}
      {isPagination && (
        <div className={styles.pagination}>
          <button
            className={styles.paginationPrev}
            onClick={filters.prevPage}
            disabled={filters.state.page <= 1}
          >
            <SvgArrowLeft
              className={classNames(styles.icon, styles.iconPagination)}
            />
          </button>
          {[...Array(pages).keys()].map((p) => (
            <button
              className={classNames(styles.paginationBtn, {
                [styles.paginationActive]: filters.state.page === p + 1,
              })}
              onClick={() => filters.setPage(p + 1)}
              key={p}
            >
              {p + 1}
            </button>
          ))}
          <button
            className={styles.paginationNext}
            onClick={filters.nextPage}
            disabled={
              filters.state.limit * filters.state.page >= (accounts?.count ?? 0)
            }
          >
            <SvgArrowRight
              className={classNames(styles.icon, styles.iconPagination)}
            />
          </button>
        </div>
      )}
    </>
  );
};

export default Search;
