import classNames from "classnames";
import { format } from "date-fns";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../http/supabase";
import Button from "../../ui/Button";
import Icon from "../../ui/Icon";
import Popup from "../../ui/Popup";
import { SessionContext } from "../AppRouter";
import styles from "../Dashboard/DashboardPage.module.css";
import Footer from "../Footer";
import Header from "../Header";
import useToggle from "../hooks/useToggle";
import SvgArrowDown from "../icons/ArrowDown";
import SvgArrowUp from "../icons/ArrowUp";
import SvgEvernote from "../icons/Evernote";
import SvgFacebook from "../icons/Facebook";
import SvgGoogle from "../icons/Google";
import SvgInstagram from "../icons/Instagram";
import Edit from "./Edit";

const getDate = (dateString: string | undefined) => {
  if (!dateString) return;

  return format(new Date(dateString), "YYYY-MM-DD HH:mm:ss");
};

const DashboardPage = () => {
  const session = useContext(SessionContext);
  const popup = useToggle();
  const navigate = useNavigate();

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
                <p className={styles.totalValue}>12</p>
              </div>
              <div className={styles.list}>
                <div className={styles.listItem}>
                  <div className={styles.provider}>
                    <Icon glyph={SvgEvernote} className={styles.providerIcon} />
                    <span>Evernote</span>
                  </div>
                  <div>
                    <span>1</span>
                  </div>
                </div>
                <div className={styles.listItem}>
                  <div className={styles.provider}>
                    <Icon glyph={SvgGoogle} className={styles.providerIcon} />
                    <span>Google</span>
                  </div>
                  <div>
                    <span>2</span>
                  </div>
                </div>
                <div className={styles.listItem}>
                  <div className={styles.provider}>
                    <Icon
                      glyph={SvgInstagram}
                      className={styles.providerIcon}
                    />
                    <span>Instagram</span>
                  </div>
                  <div>
                    <span>8</span>
                  </div>
                </div>
                <div className={styles.listItem}>
                  <div className={styles.provider}>
                    <Icon glyph={SvgFacebook} className={styles.providerIcon} />
                    <span>Facebook</span>
                  </div>
                  <div>
                    <span>3</span>
                  </div>
                </div>
              </div>
              <div className={styles.btnRow}>
                <Button
                  onClick={() => navigate("/youraccounts")}
                  scheme="secondary"
                >
                  All shared accounts
                </Button>
              </div>
            </div>
          </div>
          <div className={styles.column}>
            <div className={classNames(styles.box, styles.statisticBox)}>
              <h2 className={styles.subtitle}>Your votes</h2>
              <div className={styles.total}>
                <p className={styles.totalLabel}>Total</p>
                <p className={styles.totalValue}>64</p>
              </div>
              <div className={styles.list}>
                <div className={styles.listItem}>
                  <div className={styles.provider}>
                    <Icon glyph={SvgEvernote} className={styles.providerIcon} />
                    <span>sam</span>
                  </div>
                  <div>
                    <Icon glyph={SvgArrowDown} className={styles.iconRed} />
                  </div>
                </div>
                <div className={styles.listItem}>
                  <div className={styles.provider}>
                    <Icon glyph={SvgGoogle} className={styles.providerIcon} />
                    <span>AdAm</span>
                  </div>
                  <div>
                    <Icon glyph={SvgArrowUp} className={styles.iconGreen} />
                  </div>
                </div>
                <div className={styles.listItem}>
                  <div className={styles.provider}>
                    <Icon
                      glyph={SvgInstagram}
                      className={styles.providerIcon}
                    />
                    <span>kortnei85</span>
                  </div>
                  <div>
                    <Icon glyph={SvgArrowDown} className={styles.iconRed} />
                  </div>
                </div>
                <div className={styles.listItem}>
                  <div className={styles.provider}>
                    <Icon glyph={SvgFacebook} className={styles.providerIcon} />
                    <span>asdfasdf</span>
                  </div>
                  <div>
                    <span>
                      <Icon glyph={SvgArrowUp} className={styles.iconGreen} />
                    </span>
                  </div>
                </div>
                <div className={styles.listItem}>
                  <div className={styles.provider}>
                    <Icon glyph={SvgFacebook} className={styles.providerIcon} />
                    <span>jaiden.s</span>
                  </div>
                  <div>
                    <Icon glyph={SvgArrowUp} className={styles.iconGreen} />
                  </div>
                </div>
              </div>
              <div className={styles.btnRow}>
                <Button
                  onClick={() => navigate("/youraccounts")}
                  scheme="secondary"
                >
                  All your activities
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default DashboardPage;
