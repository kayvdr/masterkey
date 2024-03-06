import classNames from "classnames";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { KeyedMutator } from "swr";
import { SessionContext } from "../components/AppRouter";
import SvgArrowDown from "../components/icons/ArrowDown";
import SvgArrowUp from "../components/icons/ArrowUp";
import SvgClose from "../components/icons/Close";
import SvgCopy from "../components/icons/Copy";
import SvgDelete from "../components/icons/Delete";
import SvgEdit from "../components/icons/Edit";
import SvgKey from "../components/icons/Key";
import SvgUser from "../components/icons/User";
import { useOnClickOutside } from "../hooks/useOnClickOutside";
import useToggle from "../hooks/useToggle";
import {
  createVote,
  deleteAccount,
  deleteVote,
  getVotesByAccountId,
} from "../http/api";
import { Account, Vote } from "../types";
import { logoMapping } from "../utils";
import AccountItem from "./AccountItem";
import itemStyles from "./AccountItem.module.css";
import styles from "./AccountList.module.css";
import Icon from "./Icon";
import Popup from "./Popup";

interface Props {
  accounts: Account[];
  mutate: KeyedMutator<{
    total: number;
    accounts: Account[];
  }>;
}

const AccountList = ({ accounts, mutate }: Props) => {
  const details = useToggle();
  const popup = useToggle();
  const [detailData, setDetailData] = useState<Account>();
  const [accountVote, setUserVote] = useState<Vote>();
  const session = useContext(SessionContext);
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(wrapperRef, details.close);

  useEffect(() => {
    const fetchData = async () => {
      if (!detailData?.id) return;

      const { data } = getVotesByAccountId(detailData.id);

      const existingVote = data?.votes.find(
        (vote) => vote.creator_id === session?.user.id
      );

      setUserVote(existingVote);
    };

    fetchData();
  }, [detailData]);

  const handleVote = async (value: "votes_up" | "votes_down") => {
    if (!detailData) return;

    accountVote?.id
      ? await deleteVote(accountVote.id)
      : await createVote({
          value: value === "votes_up" ? "up" : "down",
          account_id: detailData.id ?? "",
          creator_id: session?.user.id ?? "",
        });

    mutate({
      accounts: accounts.map((a) =>
        a.id === detailData.id
          ? {
              ...a,
              [value]: accountVote?.id ? a[value] - 1 : a[value] + 1,
            }
          : a
      ),
      total: 0,
    });

    setDetailData({
      ...detailData,
      [value]: accountVote?.id ? detailData[value] - 1 : detailData[value] + 1,
    });
  };

  const platformIcon =
    detailData?.platform_name && logoMapping[detailData.platform_name];

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <div className={styles.list}>
        {accounts.map((a) => (
          <AccountItem
            key={a.id}
            account={a}
            onClick={() => (setDetailData(a), details.open())}
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
              <p className={styles.platformText}>{detailData?.platform_name}</p>
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
                  [styles.btnActive]: accountVote?.value === "up",
                })}
                onClick={async () => {
                  if (!session) {
                    navigate("/login");
                    return;
                  }

                  handleVote("votes_up");
                }}
                disabled={accountVote?.value === "down"}
              >
                <Icon glyph={SvgArrowUp} className={itemStyles.iconGreen} />
                <p className={itemStyles.textSmall}>{detailData?.votes_up}</p>
              </button>
              <button
                className={classNames(styles.btn, {
                  [styles.btnActive]: accountVote?.value === "down",
                })}
                onClick={async () => {
                  if (!detailData) return;

                  if (!session) {
                    navigate("/login");
                    return;
                  }

                  handleVote("votes_down");
                }}
                disabled={accountVote?.value === "up"}
              >
                <Icon glyph={SvgArrowDown} className={itemStyles.iconRed} />
                <p className={itemStyles.textSmall}>{detailData?.votes_down}</p>
              </button>
            </div>
            {detailData?.creator_id === session?.user.id && (
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
                        detailData?.id && deleteAccount(detailData.id);

                        const deletedAccountList = accounts.filter(
                          (u) => u.id !== detailData?.id
                        );

                        mutate({
                          accounts: deletedAccountList,
                          total: deletedAccountList.length,
                        });

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

export default AccountList;
