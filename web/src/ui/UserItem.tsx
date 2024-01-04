import classNames from "classnames";
import SvgArrowDown from "../components/icons/ArrowDown";
import SvgArrowUp from "../components/icons/ArrowUp";
import SvgUser from "../components/icons/User";
import { FullAccount } from "../types";
import Icon from "./Icon";
import styles from "./UserItem.module.css";

interface Props {
  user: FullAccount;
  onClick: () => void;
}

const UserItem = ({ user, onClick }: Props) => (
  <>
    <button className={styles.row} onClick={onClick}>
      {user.platform.icon && (
        <a
          href={user.platform.href}
          className={styles.platform}
          target="_blank"
        >
          <Icon glyph={user.platform.icon} className={styles.platformIcon} />
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
        <p className={classNames(styles.textSmall)}>{user.time}</p>
      </div>
    </button>
  </>
);

export default UserItem;
