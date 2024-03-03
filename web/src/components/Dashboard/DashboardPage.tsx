import classNames from "classnames";
import { format } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useToggle from "../../hooks/useToggle";
import { getAccountsByCreatorId, getVotesByCreatorId } from "../../http/api";
import { supabase } from "../../http/supabase";
import { FullVote } from "../../types";
import Button from "../../ui/Button";
import Icon from "../../ui/Icon";
import Popup from "../../ui/Popup";
import { logoMapping } from "../../utils";
import { SessionContext } from "../AppRouter";
import Footer from "../Footer";
import Header from "../Header";
import SvgArrowDown from "../icons/ArrowDown";
import SvgArrowUp from "../icons/ArrowUp";
import styles from "./DashboardPage.module.css";
import Edit from "./Edit";

const getDate = (dateString: string | undefined) => {
  if (!dateString) return;

  return format(new Date(dateString), "yyyy-MM-dd HH:mm:ss");
};

interface List {
  [key: string]: number;
}

interface FullUsersInfo {
  count: number | undefined;
  items: List | undefined;
}

interface FullVotesInfo {
  count: number | undefined;
  items: FullVote[] | undefined;
}

const DashboardPage = () => {
  const session = useContext(SessionContext);
  const popup = useToggle();
  const navigate = useNavigate();
  const [sharings, setSharings] = useState<FullUsersInfo>();
  const [votes, setVotes] = useState<FullVotesInfo>();

  useEffect(() => {
    const fetchAccounts = async () => {
      if (!session) return;
      const fetchedUsers = await getAccountsByCreatorId(session.user.id);
      const groupedUsers = fetchedUsers?.items.reduce<List>((prev, curr) => {
        const prevValue = prev[curr.platform.name];

        return {
          ...prev,
          [curr.platform.name]: prevValue ? prevValue + 1 : 1,
        };
      }, {});

      setSharings({ count: fetchedUsers?.count, items: groupedUsers });
    };
    const fetchVotes = async () => {
      if (!session) return;
      const fetchedVotes = await getVotesByCreatorId(session.user.id);

      setVotes({ count: fetchedVotes?.count, items: fetchedVotes?.items });
    };

    fetchAccounts();
    fetchVotes();
  }, []);

  return (
    <>
      <Header />
      <section className={styles.sectionGrey}>
        <div className="container">
          <h1 className={styles.title}>
            Welcome Back, {session?.user.email?.split("@")[0]}
          </h1>
        </div>
      </section>
      <section className="container">
        <div className={styles.wrapper}>
          <div className={styles.column}>
            <div className={classNames(styles.box, styles.profile)}>
              <h2 className={styles.subtitle}>Profile</h2>
              <div>
                <div className={styles.profileWrapper}>
                  <p className={styles.itemTitle}>
                    <strong>E-Mail Address</strong>
                  </p>
                  <Edit
                    name="email"
                    value={session?.user.email ?? ""}
                    label="E-Mail"
                  />
                </div>
                <div className={styles.profileWrapper}>
                  <p className={styles.itemTitle}>
                    <strong>Password</strong>
                  </p>
                  <a
                    href="#"
                    onClick={async () => {
                      const email = session?.user.email;
                      email &&
                        (await supabase.auth.resetPasswordForEmail(email));
                    }}
                    className={styles.link}
                  >
                    Send Password Reset Email
                  </a>
                </div>
                <div className={styles.profileWrapper}>
                  <p className={styles.itemTitle}>
                    <strong>Delete Account</strong>
                  </p>
                  <a
                    href="#"
                    onClick={(e) => (e.preventDefault(), popup.open())}
                    className={styles.delete}
                  >
                    Delete Permanently
                  </a>
                  {popup.isOpen && (
                    <Popup
                      title="Delete Profile Permanently"
                      text="Are you sure you want to delete your profile?"
                      onClose={popup.close}
                      onSubmit={async () => {
                        const id = session?.user.id;
                        id && (await supabase.auth.admin.deleteUser(id));
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className={styles.box}>
              <h2 className={styles.subtitle}>Information</h2>
              <div className={styles.profileWrapper}>
                <p className={styles.itemTitle}>
                  <strong>Created</strong>
                </p>
                <p className={styles.itemValue}>
                  {getDate(session?.user.created_at)}
                </p>
              </div>
              <div className={styles.profileWrapper}>
                <p className={styles.itemTitle}>
                  <strong>Last Sign In</strong>
                </p>
                <p className={styles.itemValue}>
                  {getDate(session?.user.last_sign_in_at)}
                </p>
              </div>
              <div className={styles.profileWrapper}>
                <p className={styles.itemTitle}>
                  <strong>Last Update</strong>
                </p>
                <p className={styles.itemValue}>
                  {getDate(session?.user.updated_at)}
                </p>
              </div>
            </div>
          </div>
          <div className={styles.column}>
            <div className={classNames(styles.box, styles.statisticBox)}>
              <h2 className={styles.subtitle}>Your sharings</h2>
              <div className={styles.total}>
                <p className={styles.totalLabel}>Total</p>
                <p className={styles.totalValue}>{sharings?.count ?? 0}</p>
              </div>
              <div className={styles.list}>
                {sharings?.items &&
                  Object.entries(sharings.items).map(([name, count]) => {
                    const icon = logoMapping[name];

                    return (
                      <div className={styles.listItem} key={name}>
                        <div className={styles.provider}>
                          {icon && (
                            <Icon
                              glyph={icon}
                              className={styles.providerIcon}
                            />
                          )}
                          <span>{name}</span>
                        </div>
                        <div>
                          <span>{count}</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
              {sharings?.count && (
                <div className={styles.btnRow}>
                  <Button
                    onClick={() => navigate("/youraccounts")}
                    scheme="secondary"
                  >
                    All shared accounts
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className={styles.column}>
            <div className={classNames(styles.box, styles.statisticBox)}>
              <h2 className={styles.subtitle}>Your votes</h2>
              <div className={styles.total}>
                <p className={styles.totalLabel}>Total</p>
                <p className={styles.totalValue}>{votes?.count}</p>
              </div>
              <div className={styles.list}>
                {votes?.items?.map((vote) => {
                  const icon = logoMapping[vote.platformName];

                  return (
                    <div className={styles.listItem} key={vote.id}>
                      <div className={styles.provider}>
                        {icon && (
                          <Icon glyph={icon} className={styles.providerIcon} />
                        )}
                        <span>{vote.username}</span>
                      </div>
                      <div>
                        {vote.value === "up" ? (
                          <Icon
                            glyph={SvgArrowUp}
                            className={styles.iconGreen}
                          />
                        ) : (
                          <Icon
                            glyph={SvgArrowDown}
                            className={styles.iconRed}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* <div className={styles.btnRow}>
                <Button
                  onClick={() => navigate("/youraccounts")}
                  scheme="secondary"
                >
                  All your activities
                </Button>
              </div> */}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default DashboardPage;
