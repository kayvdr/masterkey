import classNames from "classnames";
import { Account } from "../../types";
import { getDiff, logoMapping } from "../../utils";
import SvgArrowDown from "../icons/ArrowDown";
import SvgArrowUp from "../icons/ArrowUp";
import SvgUser from "../icons/User";
import Icon from "../ui/Icon";
import styles from "./AccountItem.module.css";

interface Props {
  account: Account;
  isActive: boolean;
  onClick: () => void;
}

const AccountItem = ({ account, isActive, onClick }: Props) => {
  const icon = logoMapping[account.platform_name];

  return (
    <>
      <button
        className={classNames(styles.row, { [styles.rowActive]: isActive })}
        onClick={onClick}
      >
        {icon && (
          <a
            href={account.platform_url}
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
            <p className={styles.text}>{account.username}</p>
          </div>
        </div>
        <div className={styles.wrapper}>
          <div className={styles.vote}>
            <Icon glyph={SvgArrowUp} className={styles.iconGreen} />
            <p className={classNames(styles.textSmall, styles.voteText)}>
              {account.votes_up}
            </p>
          </div>
          <div className={styles.vote}>
            <Icon glyph={SvgArrowDown} className={styles.iconRed} />
            <p className={classNames(styles.textSmall, styles.voteText)}>
              {account.votes_down}
            </p>
          </div>
        </div>
        <div className={styles.date}>
          <p className={classNames(styles.textSmall)}>
            {getDiff(account.created_at)}
          </p>
        </div>
      </button>
    </>
  );
};

export default AccountItem;
