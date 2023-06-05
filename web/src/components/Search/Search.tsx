import classNames from "classnames";
import { RefObject, useEffect, useState } from "react";
import { getPlatforms, getUsers } from "../../http/api";
import { FullUser, Pagination, UserResponse } from "../../types";
import UserList, { RefType } from "../../ui/UserList";
import {
  getDiff,
  getSearchParams,
  logoMapping,
  setSearchParams,
} from "../../utils";
import SvgArrowLeft from "../icons/ArrowLeft";
import SvgArrowRight from "../icons/ArrowRight";
import styles from "./Search.module.css";

interface Props {
  title?: string;
  searchTerm?: string;
  isPagination?: boolean;
  sort?: keyof UserResponse;
  userListRef?: RefObject<RefType>;
}

const isKeyofUser = (value: string): value is keyof UserResponse =>
  [
    "id",
    "username",
    "password",
    "platform_id",
    "votes_up",
    "votes_down",
    "created_at",
  ].includes(value as keyof UserResponse);

const Search = ({
  title,
  searchTerm,
  isPagination = true,
  sort,
  userListRef,
}: Props) => {
  const [users, setUsers] = useState<FullUser[]>();
  const [count, setCount] = useState<number>();
  const [pagination, setPagination] = useState<Pagination>({
    limit: 12,
    page: 1,
    sort: sort as keyof UserResponse,
  });

  useEffect(() => {
    const searchQuery = getSearchParams("sort");
    if (!searchQuery || sort) return;

    isKeyofUser(searchQuery) &&
      setPagination({ ...pagination, sort: searchQuery });
  }, []);

  let pages = count && Math.ceil(count / pagination.limit);

  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = await getUsers({
        q: searchTerm ?? "",
        order: pagination.sort === "username" ? "ASC" : "DESC",
        ...pagination,
      });
      const fetchedPlatforms = await getPlatforms();

      const users = fetchedUsers?.items.map<FullUser>((user) => {
        const time = user.created_at && getDiff(user.created_at);

        const platform = fetchedPlatforms?.find(
          (p) => p.id === user.platform_id
        );

        return {
          id: user.id,
          username: user.username,
          password: user.password,
          platform: {
            id: platform?.id,
            href: platform?.url,
            icon: platform && logoMapping[platform.name],
            name: platform?.name,
          },
          votesUp: user.votes_up ?? 0,
          votesDown: user.votes_down ?? 0,
          time: time,
          creatorId: user.creator_id,
        };
      });

      setUsers(users);
      setCount(fetchedUsers?.count);
    };

    fetchUsers();
  }, [pagination, searchTerm]);

  return (
    <>
      <div className={styles.searchRow}>
        {title ? <h1 className={styles.rowTitle}>{title}</h1> : <div></div>}
        <div className={styles.filter}>
          <select
            value={pagination.sort ?? ""}
            onChange={(e) => {
              const value = e.target.value as keyof UserResponse;
              if (!isKeyofUser(value) || sort) return;
              setPagination({ ...pagination, sort: value });
              setSearchParams("sort", value);
            }}
            className={classNames(styles.sortSelect, {
              [styles.selectActive]: !!pagination.sort,
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
      <div>
        {users?.length === 0 && <div>No Accounts found</div>}
        {users && (
          <UserList
            ref={userListRef}
            users={users}
            setUsers={(data) => setUsers(data)}
          />
        )}
      </div>
      {isPagination && (
        <div className={styles.pagination}>
          <button
            className={styles.paginationPrev}
            onClick={() => (
              setPagination({ ...pagination, page: pagination.page - 1 }),
              userListRef?.current?.toggleDetails()
            )}
            disabled={pagination.page <= 1}
          >
            <SvgArrowLeft
              className={classNames(styles.icon, styles.iconPagination)}
            />
          </button>
          {[...Array(pages).keys()].map((p) => (
            <button
              className={classNames(styles.paginationBtn, {
                [styles.paginationActive]: pagination.page === p + 1,
              })}
              onClick={() => (
                setPagination({ ...pagination, page: p + 1 }),
                userListRef?.current?.toggleDetails()
              )}
              key={p}
            >
              {p + 1}
            </button>
          ))}
          <button
            className={styles.paginationNext}
            onClick={() => (
              setPagination({ ...pagination, page: pagination.page + 1 }),
              userListRef?.current?.toggleDetails()
            )}
            disabled={pagination.limit * pagination.page >= (count ?? 0)}
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
