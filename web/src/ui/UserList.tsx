import { useState } from "react";
import useToggle from "../components/hooks/useToggle";
import SvgClose from "../components/icons/Close";
import { User } from "../types";
import Icon from "./Icon";
import UserItem from "./UserItem";
import styles from "./UserList.module.css";

interface Props {
  users: User[];
}

const UserList = ({ users }: Props) => {
  const details = useToggle();
  const [detailData, setDetailData] = useState<User>();

  return (
    <div className={styles.wrapper}>
      <div className={styles.list}>
        {users.map((user) => (
          <UserItem
            user={user}
            onClick={() => (
              setDetailData({
                username: user.username,
                votesUp: user.votesUp,
                votesDown: user.votesDown,
                platform: user.platform,
                time: user.time,
              }),
              details.open()
            )}
            key={user.id}
          />
        ))}
      </div>
      {details.isOpen && (
        <div className={styles.details}>
          <header className={styles.detailsHeader}>
            <h2>Details</h2>
            <button className={styles.closeBtn} onClick={details.close}>
              <Icon glyph={SvgClose} className={styles.iconClose} />
            </button>
          </header>
          <div>
            <p>{detailData?.username}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
