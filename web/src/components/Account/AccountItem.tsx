import classNames from "classnames";
import { Account } from "../../types";
import Icon from "../../ui/Icon";
import { getDiff, logoMapping } from "../../utils";
import SvgArrowDown from "../icons/ArrowDown";
import SvgArrowUp from "../icons/ArrowUp";
import SvgUser from "../icons/User";
import styles from "./AccountItem.module.css";

interface Props {
  account: Account;
  onClick: () => void;
}

const AccountItem = ({ account: user, onClick }: Props) => {
  const icon = logoMapping[user.platform_name];

  return (
    <>
      <button className={styles.row} onClick={onClick}>
        {icon && (
          <a
            href={user.platform_url}
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
              {user.votes_up}
            </p>
          </div>
          <div className={styles.vote}>
            <Icon glyph={SvgArrowDown} className={styles.iconRed} />
            <p className={classNames(styles.textSmall, styles.voteText)}>
              {user.votes_down}
            </p>
          </div>
        </div>
        <div className={styles.date}>
          <p className={classNames(styles.textSmall)}>
            {getDiff(user.created_at)}
          </p>
        </div>
      </button>
    </>
  );
};

export default AccountItem;
