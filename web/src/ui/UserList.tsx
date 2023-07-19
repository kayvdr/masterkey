import classNames from "classnames";
import {
  Ref,
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
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
import { deleteUser, deleteVote, getVote, setVote } from "../http/api";
import { FullUser, Vote } from "../types";
import { logoMapping } from "../utils";
import Icon from "./Icon";
import Popup from "./Popup";
import UserItem from "./UserItem";
import itemStyles from "./UserItem.module.css";
import styles from "./UserList.module.css";

interface Props {
  users: FullUser[];
  setUsers: (data: FullUser[]) => void;
}

export interface RefType {
  toggleDetails: () => void;
}

const UserList = ({ users, setUsers }: Props, ref: Ref<RefType>) => {
  const details = useToggle();
  const popup = useToggle();
  const [detailData, setDetailData] = useState<FullUser>();
  const [userVote, setUserVote] = useState<Vote>();
  const session = useContext(SessionContext);
  const navigate = useNavigate();

  useImperativeHandle(ref, () => ({
    toggleDetails() {
      details.close();
    },
  }));

  useEffect(() => {
    const fetchData = async () => {
      if (!detailData?.id) return;

      const votes = await getVote(detailData.id);

      const typedVotes: Vote[] | undefined = votes?.map((vote) => ({
        id: vote.id,
        value: vote.value,
        userId: vote.userId,
        creatorId: vote.creatorId,
      }));

      const existingVote = typedVotes?.find(
        (vote) => vote.creatorId === session?.user.id
      );

      setUserVote(existingVote);
    };

    fetchData();
  }, [detailData]);

  const handleVote = async (value: "votesUp" | "votesDown") => {
    if (!detailData) return;

    userVote?.id
      ? await deleteVote(userVote.id)
      : await setVote({
          value: value === "votesUp" ? "up" : "down",
          userId: detailData.id ?? "",
          creatorId: session?.user.id ?? "",
        });

    setUsers(
      users.map((user) =>
        user.id === detailData.id
          ? {
              ...user,
              [value]: userVote?.id ? user[value] - 1 : user[value] + 1,
            }
          : user
      )
    );

    setDetailData({
      ...detailData,
      [value]: userVote?.id ? detailData[value] - 1 : detailData[value] + 1,
    });
  };

  const platformIcon =
    detailData?.platform.name && logoMapping[detailData.platform.name];

  return (
    <div className={styles.wrapper}>
      <div className={styles.list}>
        {users.map((user) => (
          <UserItem
            user={user}
            onClick={() => (setDetailData(user), details.open())}
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
            <div className={styles.platformItem}>
              {platformIcon && (
                <Icon glyph={platformIcon} className={styles.platformIcon} />
              )}
              <p className={styles.platformText}>{detailData?.platform.name}</p>
            </div>
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
                className={classNames(styles.btn, {
                  [styles.btnActive]: userVote?.value === "up",
                })}
                onClick={async () => {
                  if (!session) {
                    navigate("/login");
                    return;
                  }

                  handleVote("votesUp");
                }}
                disabled={userVote?.value === "down"}
              >
                <Icon glyph={SvgArrowUp} className={itemStyles.iconGreen} />
                <p className={itemStyles.textSmall}>{detailData?.votesUp}</p>
              </button>
              <button
                className={classNames(styles.btn, {
                  [styles.btnActive]: userVote?.value === "down",
                })}
                onClick={async () => {
                  if (!detailData) return;

                  if (!session) {
                    navigate("/login");
                    return;
                  }

                  handleVote("votesDown");
                }}
                disabled={userVote?.value === "up"}
              >
                <Icon glyph={SvgArrowDown} className={itemStyles.iconRed} />
                <p className={itemStyles.textSmall}>{detailData?.votesDown}</p>
              </button>
            </div>
            {detailData?.creatorId === session?.user.id && (
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

export default forwardRef(UserList);
