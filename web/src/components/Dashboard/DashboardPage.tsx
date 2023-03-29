import classNames from "classnames";
import { useContext } from "react";
import { supabase } from "../../http/supabase";
import { SessionContext } from "../AppRouter";
import styles from "../Dashboard/DashboardPage.module.css";
import Footer from "../Footer";
import Header from "../Header";
import Edit from "./Edit";

const DashboardPage = () => {
  const session = useContext(SessionContext);

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
                    email && (await supabase.auth.resetPasswordForEmail(email));
                  }}
                  className={styles.link}
                >
                  Send Password Reset Email
                </a>
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
