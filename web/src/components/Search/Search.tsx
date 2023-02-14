import classNames from "classnames";
import { differenceInHours, differenceInMinutes } from "date-fns";
import { useEffect, useState } from "react";
import { getUsers } from "../../http/api";
import { Glyph, Pagination, User, UsersResponse } from "../../types";
import Icon from "../../ui/Icon";
import SvgArrowDown from "../icons/ArrowDown";
import SvgArrowLeft from "../icons/ArrowLeft";
import SvgArrowRight from "../icons/ArrowRight";
import SvgArrowUp from "../icons/ArrowUp";
import SvgCopy from "../icons/Copy";
import SvgDropbox from "../icons/Dropbox";
import SvgEvernote from "../icons/Evernote";
import SvgFacebook from "../icons/Facebook";
import SvgGoogle from "../icons/Google";
import SvgInstagram from "../icons/Instagram";
import SvgKey from "../icons/Key";
import SvgOpenNew from "../icons/OpenNew";
import SvgSnapchat from "../icons/Snapchat";
import SvgTikTok from "../icons/Tiktok";
import SvgTinder from "../icons/Tinder";
import SvgTwitter from "../icons/Twitter";
import SvgUser from "../icons/User";
import styles from "../Search/Search.module.css";

const logoMapping: { [key in string]: Glyph } = {
  "d6fbba90-4e07-4d2a-906c-9229610c95c4": SvgInstagram,
  "a8f71f23-8e04-42e5-ab69-5baf7b78aea0": SvgFacebook,
  "7389c780-86b1-42b7-a118-7f0830109464": SvgSnapchat,
  "4e1a32db-9e0b-492d-bc8c-232359292fd9": SvgGoogle,
  "ea191b37-8878-40c8-9a21-01c7722be456": SvgTinder,
  "6056b64e-c72c-4e15-a422-99f4af4f564b": SvgEvernote,
  "4e0852cc-7aba-4f32-b3be-c4e7c598ea84": SvgTikTok,
  "fc4d2d2f-31ae-4f99-b4d2-0c9322ebfdc5": SvgTwitter,
  "16f32e1b-cb87-4922-b44c-b8b2ddede3fc": SvgDropbox,
};

interface Props {
  title?: string;
  searchTerm?: string;
  isPagination?: boolean;
  sort?: keyof User;
}

const Search = ({ title, searchTerm, isPagination = true, sort }: Props) => {
  const [users, setUsers] = useState<UsersResponse>();
  const [pagination, setPagination] = useState<Pagination>({
    limit: 12,
    page: 1,
    sort,
  });

  let pages = users && Math.ceil(users.count / pagination.limit);

  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = await getUsers({
        q: searchTerm ?? "",
        order: pagination.sort === "username" ? "ASC" : "DESC",
        ...pagination,
      });

      setUsers(fetchedUsers ?? { count: 0, items: [] });
    };

    fetchUsers();
  }, [pagination, searchTerm]);

  return (
    <>
      <div className={styles.searchRow}>
        {title && <h1 className="title">{title}</h1>}
        <div className={styles.filter}>
          <select
            defaultValue={pagination.sort}
            onChange={(e) => {
              const value = e.target.value as keyof User;
              setPagination({ ...pagination, sort: value });
            }}
            className={classNames(styles.sortSelect, {
              [styles.selectActive]: !!pagination.sort,
            })}
            disabled={!!sort}
          >
            <option value={undefined} disabled={true} selected={true}>
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
        {users?.items.length === 0 && <div>No Accounts found</div>}
        {users?.items.map((user) => {
          const hoursDiff = differenceInHours(
            new Date(),
            new Date(user.created_at)
          );
          const minutesDiff = differenceInMinutes(
            new Date(),
            new Date(user.created_at)
          );

          const icon = logoMapping[user.platform_id];

          return (
            <div className={styles.row} key={user.id}>
              {icon && (
                <a
                  href={user.domain}
                  className={styles.platform}
                  target="_blank"
                >
                  <Icon glyph={icon} className={styles.platformIcon} />
                  <Icon glyph={SvgOpenNew} className={styles.open} />
                </a>
              )}
              <div className={styles.data}>
                <button
                  className={styles.copyBtn}
                  onClick={() => {
                    navigator.clipboard.writeText(user.username);
                  }}
                >
                  <SvgUser className={styles.icon} />
                  <p className={styles.text}>{user.username}</p>
                  <SvgCopy
                    className={classNames(styles.icon, styles.iconCopy)}
                  />
                </button>
              </div>
              <div className={styles.data}>
                <button
                  className={styles.copyBtn}
                  onClick={() => {
                    navigator.clipboard.writeText(user.password);
                  }}
                >
                  <SvgKey className={styles.icon} />
                  <p className={styles.text}>{user.password}</p>
                  <SvgCopy
                    className={classNames(styles.icon, styles.iconCopy)}
                  />
                </button>
              </div>
              <div className={styles.votes}>
                <div className={styles.vote}>
                  <SvgArrowUp
                    className={classNames(styles.icon, styles.iconGreen)}
                  />
                  <p className={classNames(styles.textSmall, styles.voteText)}>
                    {user.votes_up}
                  </p>
                </div>
                <div className={styles.vote}>
                  <SvgArrowDown
                    className={classNames(styles.icon, styles.iconRed)}
                  />
                  <p className={classNames(styles.textSmall, styles.voteText)}>
                    {user.votes_down}
                  </p>
                </div>
              </div>
              <div>
                <p className={classNames(styles.textSmall)}>
                  {hoursDiff ? `${hoursDiff}h` : `${minutesDiff}m`}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      {isPagination && (
        <div className={styles.pagination}>
          <button
            className={styles.paginationPrev}
            onClick={() =>
              setPagination({ ...pagination, page: pagination.page - 1 })
            }
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
              onClick={() => setPagination({ ...pagination, page: p + 1 })}
              key={p}
            >
              {p + 1}
            </button>
          ))}
          <button
            className={styles.paginationNext}
            onClick={() =>
              setPagination({ ...pagination, page: pagination.page + 1 })
            }
            disabled={
              users && pagination.limit * pagination.page >= users.count
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
