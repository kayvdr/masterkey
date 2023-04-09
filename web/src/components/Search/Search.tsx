import classNames from "classnames";
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInYears,
} from "date-fns";
import { useEffect, useState } from "react";
import { getPlatforms, getUsers } from "../../http/api";
import { Glyph, Pagination, User, UserResponse } from "../../types";
import UserList from "../../ui/UserList";
import styles from "../Search/Search.module.css";
import SvgArrowLeft from "../icons/ArrowLeft";
import SvgArrowRight from "../icons/ArrowRight";
import SvgDiscord from "../icons/Discord";
import SvgDropbox from "../icons/Dropbox";
import SvgEvernote from "../icons/Evernote";
import SvgFacebook from "../icons/Facebook";
import SvgGoogle from "../icons/Google";
import SvgInstagram from "../icons/Instagram";
import SvgOnlyfans from "../icons/Onlyfans";
import SvgPinterest from "../icons/Pinterest";
import SvgReddit from "../icons/Reddit";
import SvgSnapchat from "../icons/Snapchat";
import SvgStackExchange from "../icons/StackExchange";
import SvgStackOverflow from "../icons/StackOverflow";
import SvgTikTok from "../icons/Tiktok";
import SvgTinder from "../icons/Tinder";
import SvgTwitch from "../icons/Twitch";
import SvgTwitter from "../icons/Twitter";

const logoMapping: { [key in string]: Glyph } = {
  Instagram: SvgInstagram,
  Facebook: SvgFacebook,
  Snapchat: SvgSnapchat,
  Google: SvgGoogle,
  Tinder: SvgTinder,
  Evernote: SvgEvernote,
  TikTok: SvgTikTok,
  Twitter: SvgTwitter,
  Dropbox: SvgDropbox,
  Onlyfans: SvgOnlyfans,
  Discord: SvgDiscord,
  Pinterest: SvgPinterest,
  Reddit: SvgReddit,
  "Stack Exchange": SvgStackExchange,
  "Stack Overflow": SvgStackOverflow,
  Twitch: SvgTwitch,
};

const getDiff = (createdAt: string) => {
  const date = new Date(createdAt);
  const today = new Date();

  const minutes = differenceInMinutes(today, date);
  const hours = differenceInHours(today, date);
  const days = differenceInDays(today, date);
  const months = differenceInMonths(today, date);
  const years = differenceInYears(today, date);

  if (years) return `${years}y`;
  if (months) return `${months}M`;
  if (days) return `${days}d`;
  if (hours) return `${hours}h`;

  return `${minutes}m`;
};

interface Props {
  title?: string;
  searchTerm?: string;
  isPagination?: boolean;
  sort?: keyof User;
}

const Search = ({ title, searchTerm, isPagination = true, sort }: Props) => {
  const [users, setUsers] = useState<User[]>();
  const [count, setCount] = useState<number>();
  const [pagination, setPagination] = useState<Pagination>({
    limit: 12,
    page: 1,
    sort: sort as keyof UserResponse,
  });

  let pages = count && Math.ceil(count / pagination.limit);

  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = await getUsers({
        q: searchTerm ?? "",
        order: pagination.sort === "username" ? "ASC" : "DESC",
        ...pagination,
      });
      const fetchedPlatforms = await getPlatforms();

      const users = fetchedUsers?.items.map<User>((user) => {
        const time = user.created_at && getDiff(user.created_at);

        const platform = fetchedPlatforms?.find(
          (p) => p.id === user.platform_id
        );

        return {
          id: user.id,
          username: user.username,
          password: user.password,
          platform: {
            href: platform?.domain,
            icon: platform && logoMapping[platform.name],
          },
          votesUp: user.votes_up,
          votesDown: user.votes_down,
          time: time,
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
        {title && <h1 className="title">{title}</h1>}
        <div className={styles.filter}>
          <select
            value={pagination.sort ?? ""}
            onChange={(e) => {
              const value = e.target.value as keyof UserResponse;
              setPagination({ ...pagination, sort: value });
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
        {users && <UserList users={users} />}
      </div>
      {isPagination && (
        <div className={styles.pagination}>
          <button
            className={styles.paginationPrev}
            onClick={() => {
              setPagination({ ...pagination, page: pagination.page - 1 });
            }}
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
            onClick={() => {
              setPagination({ ...pagination, page: pagination.page + 1 });
            }}
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
