import classNames from "classnames";
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInYears,
} from "date-fns";
import { useEffect, useState } from "react";
import { getPlatforms, getUsers, patchUser } from "../../http/api";
import { Glyph, Pagination, Platform, User, UsersResponse } from "../../types";
import Icon from "../../ui/Icon";
import SvgArrowDown from "../icons/ArrowDown";
import SvgArrowLeft from "../icons/ArrowLeft";
import SvgArrowRight from "../icons/ArrowRight";
import SvgArrowUp from "../icons/ArrowUp";
import SvgCopy from "../icons/Copy";
import SvgDiscord from "../icons/Discord";
import SvgDropbox from "../icons/Dropbox";
import SvgEvernote from "../icons/Evernote";
import SvgFacebook from "../icons/Facebook";
import SvgGoogle from "../icons/Google";
import SvgInstagram from "../icons/Instagram";
import SvgKey from "../icons/Key";
import SvgOnlyfans from "../icons/Onlyfans";
import SvgOpenNew from "../icons/OpenNew";
import SvgPinterest from "../icons/Pinterest";
import SvgReddit from "../icons/Reddit";
import SvgSnapchat from "../icons/Snapchat";
import SvgStackExchange from "../icons/StackExchange";
import SvgStackOverflow from "../icons/StackOverflow";
import SvgTikTok from "../icons/Tiktok";
import SvgTinder from "../icons/Tinder";
import SvgTwitch from "../icons/Twitch";
import SvgTwitter from "../icons/Twitter";
import SvgUser from "../icons/User";
import styles from "../Search/Search.module.css";

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
  const [users, setUsers] = useState<UsersResponse>();
  const [platforms, setPlatforms] = useState<Platform[]>();
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
      const fetchedPlatforms = await getPlatforms();

      setUsers(fetchedUsers ?? { count: 0, items: [] });
      setPlatforms(fetchedPlatforms);
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
              const value = e.target.value as keyof User;
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
        {users?.items.length === 0 && <div>No Accounts found</div>}
        {users?.items.map((user) => {
          const time = user.created_at && getDiff(user.created_at);

          const platform = platforms?.find((p) => p.id === user.platform_id);

          const icon = platform && logoMapping[platform.name];

          return (
            <div className={styles.row} key={user.id}>
              {icon && (
                <a
                  href={platform?.domain}
                  className={styles.platform}
                  target="_blank"
                >
                  <Icon glyph={icon} className={styles.platformIcon} />
                  <Icon glyph={SvgOpenNew} className={styles.open} />
                </a>
              )}
              <div className={styles.wrapper}>
                <div className={styles.data}>
                  <button
                    className={styles.copyBtn}
                    onClick={() => {
                      navigator.clipboard.writeText(user.username);
                    }}
                  >
                    <SvgUser
                      className={classNames(styles.icon, styles.iconUsername)}
                    />
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
                    <SvgKey
                      className={classNames(styles.icon, styles.iconPassword)}
                    />
                    <p className={styles.text}>{user.password}</p>
                    <SvgCopy
                      className={classNames(styles.icon, styles.iconCopy)}
                    />
                  </button>
                </div>
              </div>
              <div className={styles.wrapper}>
                <button
                  className={styles.vote}
                  onClick={async () => {
                    const response = await patchUser({
                      ...user,
                      votes_up: (user.votes_up ?? 0) + 1,
                    });

                    if (!response) return;

                    const updatedUsers = users.items.map((u) =>
                      u.id === response.id ? response : u
                    );

                    setUsers({ ...users, items: updatedUsers });
                  }}
                >
                  <p className={classNames(styles.textSmall, styles.voteText)}>
                    {user.votes_up}
                  </p>
                  <SvgArrowUp
                    className={classNames(styles.icon, styles.iconGreen)}
                  />
                </button>
                <button
                  className={styles.vote}
                  onClick={async () => {
                    const response = await patchUser({
                      ...user,
                      votes_down: (user.votes_down ?? 0) + 1,
                    });

                    if (!response) return;

                    const updatedUsers = users.items.map((u) =>
                      u.id === response.id ? response : u
                    );

                    setUsers({ ...users, items: updatedUsers });
                  }}
                >
                  <p className={classNames(styles.textSmall, styles.voteText)}>
                    {user.votes_down}
                  </p>
                  <SvgArrowDown
                    className={classNames(styles.icon, styles.iconRed)}
                  />
                </button>
              </div>
              <div className={styles.date}>
                <p className={classNames(styles.textSmall)}>{time}</p>
              </div>
            </div>
          );
        })}
      </div>
      {isPagination && (
        <div className={styles.pagination}>
          <button
            className={styles.paginationPrev}
            onClick={() => {
              setPagination({ ...pagination, page: pagination.page - 1 });
              // setLoaded(false);
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
              // setLoaded(false);
            }}
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
