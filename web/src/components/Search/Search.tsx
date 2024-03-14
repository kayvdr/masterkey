import classNames from "classnames";
import { useEffect } from "react";
import useListFilters from "../../hooks/useListFilters";
import { getAccounts } from "../../http/api";
import { Account } from "../../types";
import { Loading } from "../../ui/Loading";
import { getSearchParams, setSearchParams } from "../../utils";
import AccountList from "../Account/AccountList";
import SvgArrowLeft from "../icons/ArrowLeft";
import SvgArrowRight from "../icons/ArrowRight";
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
  const filters = useListFilters();

  const { data, isLoading, mutate } = getAccounts({
    q: searchTerm ?? "",
    order: filters.state.sort === "username" ? "ASC" : "DESC",
    ...filters.state,
  });

  useEffect(() => {
    const querySort = getSearchParams("sort");

    !querySort && sort && filters.setSort(sort);
    isKeyofAccount(querySort) && filters.setSort(querySort);
  }, []);

  const pages = data?.total && Math.ceil(data?.total / filters.state.limit);

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
              const value = e.target.value;
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
      {data?.accounts && (
        <>
          {isLoading && <Loading />}
          {data?.total === 0 && !isLoading && <div>No Accounts found</div>}
          <AccountList accounts={data.accounts} mutate={mutate} />
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
              filters.state.limit * filters.state.page >= (data?.total ?? 0)
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
