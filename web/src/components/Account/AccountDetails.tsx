import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import useToggle from "../../hooks/useToggle";
import {
  createVote,
  deleteAccount,
  deleteVote,
  getVotesByAccountId,
} from "../../http/api";
import { Account, VoteValue } from "../../types";
import { logoMapping } from "../../utils";
import SvgArrowDown from "../icons/ArrowDown";
import SvgArrowUp from "../icons/ArrowUp";
import SvgClose from "../icons/Close";
import SvgCopy from "../icons/Copy";
import SvgDelete from "../icons/Delete";
import SvgEdit from "../icons/Edit";
import SvgKey from "../icons/Key";
import SvgUser from "../icons/User";
import Icon from "../ui/Icon";
import Popup from "../ui/Popup";
import styles from "./AccountDetails.module.css";

interface Props {
  account: Account;
  mutate: () => void;
  setAccount: (value: Account | undefined) => void;
  onClose: () => void;
}

const AccountDetails = ({ account, mutate, setAccount, onClose }: Props) => {
  const popup = useToggle();
  const navigate = useNavigate();
  const { session } = useAuth();
  const { data: accountVote, mutate: mutateVote } = getVotesByAccountId(
    account.id
  );

  const vote = accountVote?.votes?.[0];

  const platformIcon = logoMapping[account.platform_name];

  const addVote = (value: VoteValue) => {
    createVote({
      value,
      account_id: account.id,
      creator_id: session?.user.id ?? "",
    }).then(() => {
      mutate();
      mutateVote();
      setAccount({
        ...account,
        [`votes_${value}`]: account[`votes_${value}`] + 1,
      });
    });
  };

  const removeVote = (value: VoteValue) => {
    if (!vote) return;

    deleteVote(vote.id).then(() => {
      mutate();
      mutateVote();
      setAccount({
        ...account,
        [`votes_${value}`]: account[`votes_${value}`] - 1,
      });
    });
  };

  const handleVote = async (value: VoteValue) =>
    vote ? removeVote(value) : addVote(value);

  return (
    <div className={styles.details}>
      <header className={styles.detailsHeader}>
        <h2 className={styles.detailsTitle}>Details</h2>
        <button className={styles.closeBtn} onClick={onClose}>
          <Icon glyph={SvgClose} className={styles.closeIcon} />
        </button>
      </header>
      <div className={styles.listContent}>
        <div className={styles.platformItem}>
          {platformIcon && (
            <Icon glyph={platformIcon} className={styles.platformIcon} />
          )}
          <p className={styles.platformText}>{account.platform_name}</p>
        </div>
        <div className={styles.item}>
          <div className={styles.data}>
            <Icon glyph={SvgUser} className={styles.icon} />
            <p className={styles.text}>{account.username}</p>
          </div>
          <button
            className={styles.copyBtn}
            onClick={() => navigator.clipboard.writeText(account.username)}
          >
            <Icon glyph={SvgCopy} className={styles.copyIcon} />
          </button>
        </div>
        <div className={styles.item}>
          <div className={styles.data}>
            <Icon glyph={SvgKey} className={styles.icon} />
            <p className={styles.text}>{account.password}</p>
          </div>
          <button
            className={styles.copyBtn}
            onClick={() => navigator.clipboard.writeText(account.password)}
          >
            <Icon glyph={SvgCopy} className={styles.copyIcon} />
          </button>
        </div>
        <div className={styles.voteItem}>
          <button
            className={classNames(styles.btn, {
              [styles.btnActive]: vote?.value === "up",
            })}
            onClick={async () => {
              if (!session) {
                navigate("/login");
                return;
              }

              handleVote("up");
            }}
            disabled={vote?.value === "down"}
          >
            <Icon glyph={SvgArrowUp} className={styles.iconGreen} />
            <p className={styles.textSmall}>{account.votes_up}</p>
          </button>
          <button
            className={classNames(styles.btn, {
              [styles.btnActive]: vote?.value === "down",
            })}
            onClick={async () => {
              if (!session) {
                navigate("/login");
                return;
              }

              handleVote("down");
            }}
            disabled={vote?.value === "up"}
          >
            <Icon glyph={SvgArrowDown} className={styles.iconRed} />
            <p className={styles.textSmall}>{account.votes_down}</p>
          </button>
        </div>
        {account.creator_id === session?.user.id && (
          <>
            <div>
              <button
                className={styles.btn}
                onClick={() => {
                  navigate("/edit", {
                    state: { user: JSON.stringify(account) },
                  });
                }}
              >
                <Icon glyph={SvgEdit} className={styles.iconBtn} />
                <p className={styles.textSmall}>Edit</p>
              </button>
            </div>
            <div>
              <button
                className={classNames(styles.btn, styles.deleteBtn)}
                onClick={() => popup.open()}
              >
                <Icon glyph={SvgDelete} className={styles.iconBtn} />
                <p className={styles.textSmall}>Delete</p>
              </button>
              {popup.isOpen && (
                <Popup
                  title="Delete this User"
                  text="Are you sure you want to delete this user?"
                  onClose={popup.close}
                  onSubmit={() => {
                    deleteAccount(account.id).then(() => {
                      mutate();
                      popup.close();
                      setAccount(undefined);
                      onClose();
                    });
                  }}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AccountDetails;
