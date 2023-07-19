import { useContext, useEffect, useState } from "react";
import { getUsersByCreatorId } from "../../http/api";
import { FullUser } from "../../types";
import UserList from "../../ui/UserList";
import { getDiff, logoMapping } from "../../utils";
import { SessionContext } from "../AppRouter";
import Footer from "../Footer";
import Header from "../Header";
import styles from "../SharedAccounts/SharedAccountsPage.module.css";

const SharedAccounts = () => {
  const [users, setUsers] = useState<FullUser[]>();
  const session = useContext(SessionContext);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!session) return;
      const fetchedUsers = await getUsersByCreatorId(session.user.id);

      const users = fetchedUsers?.items.map<FullUser>((user) => {
        const time = user.createdAt && getDiff(user.createdAt);

        return {
          id: user.id,
          username: user.username,
          password: user.password,
          platform: {
            id: user.platformId,
            href: user.platformUrl,
            icon: logoMapping[user.platformName],
            name: user.platformName,
          },
          votesUp: user.votesUp ?? 0,
          votesDown: user.votesDown ?? 0,
          time: time,
          creatorId: user.creatorId,
        };
      });

      setUsers(users);
    };

    fetchUsers();
  }, []);

  return (
    <>
      <Header />
      <section className={styles.sectionGrey}>
        <div className="container">
          <h1 className={styles.title}>Your Shared Accounts</h1>
        </div>
      </section>
      <section>
        <div className="container">
          {users && (
            <UserList users={users} setUsers={(data) => setUsers(data)} />
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default SharedAccounts;
