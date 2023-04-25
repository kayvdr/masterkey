import classNames from "classnames";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SessionContext } from "../components/AppRouter";
import useToggle from "../components/hooks/useToggle";
import SvgArrowDown from "../components/icons/ArrowDown";
import SvgArrowUp from "../components/icons/ArrowUp";
import SvgClose from "../components/icons/Close";
import SvgCopy from "../components/icons/Copy";
import SvgDelete from "../components/icons/Delete";
import SvgEdit from "../components/icons/Edit";
import SvgKey from "../components/icons/Key";
import SvgUser from "../components/icons/User";
import { deleteUser, patchUser } from "../http/api";
import { User } from "../types";
import Icon from "./Icon";
import Popup from "./Popup";
import UserItem from "./UserItem";
import itemStyles from "./UserItem.module.css";
import styles from "./UserList.module.css";

interface Props {
  users: User[];
  setUsers: (data: User[]) => void;
}

const UserList = ({ users, setUsers }: Props) => {
  const details = useToggle();
  const popup = useToggle();
  const [detailData, setDetailData] = useState<User>();
  const session = useContext(SessionContext);
  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>
      <div className={styles.list}>
        {users.map((user) => (
          <UserItem
            user={user}
            onClick={() => (
              setDetailData({
                id: user.id,
                username: user.username,
                password: user.password,
                votesUp: user.votesUp,
                votesDown: user.votesDown,
                platform: user.platform,
                time: user.time,
                createdBy: user.createdBy,
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
              <Icon glyph={SvgClose} className={styles.closeIcon} />
            </button>
          </header>
          <div className={styles.listContent}>
            <div className={styles.item}>
              <div className={styles.data}>
                <Icon glyph={SvgUser} className={styles.icon} />
                <p className={itemStyles.text}>{detailData?.username}</p>
              </div>
              <button
                className={styles.copyBtn}
                onClick={() =>
                  detailData &&
                  navigator.clipboard.writeText(detailData.username)
                }
              >
                <Icon glyph={SvgCopy} className={styles.copyIcon} />
              </button>
            </div>
            <div className={styles.item}>
              <div className={styles.data}>
                <Icon glyph={SvgKey} className={styles.icon} />
                <p className={itemStyles.text}>{detailData?.password}</p>
              </div>
              <button
                className={styles.copyBtn}
                onClick={() =>
                  detailData?.password &&
                  navigator.clipboard.writeText(detailData.password)
                }
              >
                <Icon glyph={SvgCopy} className={styles.copyIcon} />
              </button>
            </div>
            <div className={styles.voteItem}>
              <button
                className={styles.btn}
                onClick={async () => {
                  if (!detailData) return;
                  const updatedUser: User = {
                    ...detailData,
                    votesUp: (detailData.votesUp ?? 0) + 1,
                  };

                  const user = await patchUser(updatedUser);
                  user && setDetailData(updatedUser);
                }}
              >
                <Icon glyph={SvgArrowUp} className={itemStyles.iconGreen} />
                <p className={itemStyles.textSmall}>{detailData?.votesUp}</p>
              </button>
              <button
                className={styles.btn}
                onClick={async () => {
                  if (!detailData) return;
                  const updatedUser: User = {
                    ...detailData,
                    votesDown: (detailData.votesDown ?? 0) + 1,
                  };

                  const user = await patchUser(updatedUser);
                  user && setDetailData(updatedUser);
                }}
              >
                <Icon glyph={SvgArrowDown} className={itemStyles.iconRed} />
                <p className={itemStyles.textSmall}>{detailData?.votesDown}</p>
              </button>
            </div>
            {detailData?.createdBy === session?.user.id && (
              <>
                <div>
                  <button
                    className={styles.btn}
                    onClick={() => {
                      navigate("/edit", {
                        state: { user: JSON.stringify(detailData) },
                      });
                    }}
                  >
                    <Icon glyph={SvgEdit} className={styles.iconBtn} />
                    <p className={itemStyles.textSmall}>Edit</p>
                  </button>
                </div>
                <div>
                  <button
                    className={classNames(styles.btn, styles.deleteBtn)}
                    onClick={() => popup.open()}
                  >
                    <Icon glyph={SvgDelete} className={styles.iconBtn} />
                    <p className={itemStyles.textSmall}>Delete</p>
                  </button>
                  {popup.isOpen && (
                    <Popup
                      title="Delete this User"
                      text="Are you sure you want to delete this user?"
                      onClose={popup.close}
                      onSubmit={() => {
                        detailData?.id && deleteUser(detailData.id);

                        const deletedUserList = users.filter(
                          (u) => u.id !== detailData?.id
                        );

                        setUsers(deletedUserList);

                        popup.close();
                        setDetailData(undefined);
                        details.close();
                      }}
                    />
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
