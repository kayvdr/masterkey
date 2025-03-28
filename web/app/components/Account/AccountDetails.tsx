import classNames from "classnames";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import NotificationContext, {
  showErrorNotification,
  showSuccessNotification,
} from "../../context/notificationContext";
import useToggle from "../../hooks/useToggle";
import {
  createVote,
  deleteAccount,
  deleteVote,
  getVotesByAccountId,
  reportAccount,
} from "../../http/api";
import { Account, VoteValue } from "../../types";
import { logoMapping } from "../../utils";
import SvgArrowDown from "../icons/ArrowDown";
import SvgArrowUp from "../icons/ArrowUp";
import SvgCheck from "../icons/Check";
import SvgClose from "../icons/Close";
import SvgCopy from "../icons/Copy";
import SvgDelete from "../icons/Delete";
import SvgEdit from "../icons/Edit";
import SvgKey from "../icons/Key";
import SvgReport from "../icons/Report";
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
  const popup = { report: useToggle(), delete: useToggle() };
  const dispatch = useContext(NotificationContext);
  const navigate = useNavigate();
  const { session, user } = useAuth();
  const { data: vote, mutate: mutateVote } = getVotesByAccountId(
    user?.id,
    account.id
  );
  const platformIcon = logoMapping[account.platform_name];

  const addVote = (value: VoteValue) => {
    if (!user || !session) return;

    createVote(
      {
        value,
        account_id: account.id,
        creator_id: user?.id,
      },
      session.access_token
    )
      .then((vote) => {
        mutate();
        mutateVote(vote);
        setAccount({
          ...account,
          [`votes_${value}`]: account[`votes_${value}`] + 1,
        });
      })
      .catch((error) => dispatch(showErrorNotification(error.message)));
  };

  const removeVote = (value: VoteValue) => {
    if (!vote || !session) return;

    deleteVote(vote.id, session.access_token)
      .then(() => {
        mutate();
        mutateVote(undefined);
        setAccount({
          ...account,
          [`votes_${value}`]: account[`votes_${value}`] - 1,
        });
      })
      .catch((error) => dispatch(showErrorNotification(error.message)));
  };

  const handleVote = (value: VoteValue) =>
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
        <a
          href={account.platform_url}
          target="_blank"
          className={styles.platformItem}
        >
          {platformIcon && (
            <Icon glyph={platformIcon} className={styles.platformIcon} />
          )}
          <p className={styles.platformText}>{account.platform_name}</p>
        </a>
        <div className={styles.item}>
          <div className={styles.data}>
            <Icon glyph={SvgUser} className={styles.icon} />
            <p className={styles.text}>{account.username}</p>
          </div>
          <CopyButton
            onClick={() => navigator.clipboard.writeText(account.username)}
          />
        </div>
        <div className={styles.item}>
          <div className={styles.data}>
            <Icon glyph={SvgKey} className={styles.icon} />
            <p className={styles.text}>{account.password}</p>
          </div>
          <CopyButton
            onClick={() => navigator.clipboard.writeText(account.password)}
          />
        </div>
        <div className={styles.voteItem}>
          <button
            className={classNames(styles.btn, {
              [styles.btnActive]:
                vote?.value === "up" && vote.creator_id === user?.id,
            })}
            onClick={() => {
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
              [styles.btnActive]:
                vote?.value === "down" && vote.creator_id === user?.id,
            })}
            onClick={() => {
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
        {session && (
          <div>
            <button className={styles.btn} onClick={popup.report.open}>
              <Icon glyph={SvgReport} className={styles.iconBtn} />
              <p className={styles.textSmall}>Report</p>
            </button>
            {popup.report.isOpen && (
              <Popup
                title="Report this User"
                text="Are you sure you want to report this user?"
                submitText="Yes, report"
                onClose={popup.report.close}
                onSubmit={() => {
                  if (!session || !user) return;

                  reportAccount(account.id, user.id, session.access_token)
                    .then(() => {
                      mutate();
                      dispatch(
                        showSuccessNotification("Reported successfully")
                      );
                    })
                    .catch((error) =>
                      dispatch(showErrorNotification(error.message))
                    )
                    .finally(() => {
                      popup.report.close();
                      setAccount(undefined);
                      onClose();
                    });
                }}
              />
            )}
          </div>
        )}
        {account.creator_id === user?.id && (
          <>
            <div>
              <button
                className={styles.btn}
                onClick={() => navigate(`/edit/${account.id}`)}
              >
                <Icon glyph={SvgEdit} className={styles.iconBtn} />
                <p className={styles.textSmall}>Edit</p>
              </button>
            </div>
            <div>
              <button
                className={classNames(styles.btn, styles.deleteBtn)}
                onClick={popup.delete.open}
              >
                <Icon glyph={SvgDelete} className={styles.iconBtn} />
                <p className={styles.textSmall}>Delete</p>
              </button>
              {popup.delete.isOpen && (
                <Popup
                  title="Delete this User"
                  text="Are you sure you want to delete this user?"
                  submitText="Yes, delete"
                  onClose={popup.delete.close}
                  onSubmit={() => {
                    if (!session) return;

                    deleteAccount(account.id, session.access_token)
                      .then(() => mutate())
                      .catch((error) =>
                        dispatch(showErrorNotification(error.message))
                      )
                      .finally(() => {
                        popup.delete.close();
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

interface CopyButtonProps {
  onClick: () => void;
}

const CopyButton = ({ onClick }: CopyButtonProps) => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    active && setTimeout(() => setActive(false), 3000);
  }, [active]);

  return (
    <button
      className={styles.copyBtn}
      onClick={() => {
        setActive(true);
        onClick();
      }}
    >
      <Icon
        glyph={active ? SvgCheck : SvgCopy}
        className={classNames({
          [styles.copyIcon]: !active,
          [styles.copyActive]: active,
        })}
      />
    </button>
  );
};

export default AccountDetails;
