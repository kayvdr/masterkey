import classNames from "classnames";
import SvgArrowDown from "../components/icons/ArrowDown";
import SvgArrowUp from "../components/icons/ArrowUp";
import SvgUser from "../components/icons/User";
import { Account } from "../types";
import { getDiff, logoMapping } from "../utils";
import styles from "./AccountItem.module.css";
import Icon from "./Icon";

interface Props {
  account: Account;
  onClick: () => void;
}

const AccountItem = ({ account: user, onClick }: Props) => {
  const icon = logoMapping[user.platform.name];

  return (
    <>
      <button className={styles.row} onClick={onClick}>
        {icon && (
          <a
            href={user.platform.url}
            className={styles.platform}
            target="_blank"
          >
            <Icon glyph={icon} className={styles.platformIcon} />
          </a>
        )}
        <div className={styles.wrapper}>
          <div className={styles.data}>
            <Icon
              glyph={SvgUser}
              className={classNames(styles.icon, styles.iconUsername)}
            />
            <p className={styles.text}>{user.username}</p>
          </div>
        </div>
        <div className={styles.wrapper}>
          <div className={styles.vote}>
            <Icon glyph={SvgArrowUp} className={styles.iconGreen} />
            <p className={classNames(styles.textSmall, styles.voteText)}>
              {user.votesUp}
            </p>
          </div>
          <div className={styles.vote}>
            <Icon glyph={SvgArrowDown} className={styles.iconRed} />
            <p className={classNames(styles.textSmall, styles.voteText)}>
              {user.votesDown}
            </p>
          </div>
        </div>
        <div className={styles.date}>
          <p className={classNames(styles.textSmall)}>
            {getDiff(user.createdAt)}
          </p>
        </div>
      </button>
    </>
  );
};

export default AccountItem;
