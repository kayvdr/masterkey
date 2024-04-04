import { useRef, useState } from "react";
import useMatchMedia from "../../hooks/useMatchMedia";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import useToggle from "../../hooks/useToggle";
import { Account } from "../../types";
import AccountDetails from "./AccountDetails";
import AccountItem from "./AccountItem";
import styles from "./AccountList.module.css";

interface Props {
  accounts: Account[];
  mutate: () => void;
}

const AccountList = ({ accounts, mutate }: Props) => {
  const details = useToggle();
  const [account, setAccount] = useState<Account>();
  const wrapperRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(wrapperRef, details.close);
  const matches = useMatchMedia("(max-width: 768px)");

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      {((matches && !details.isOpen) || !matches) && (
        <div className={styles.list}>
          {accounts.map((a) => (
            <AccountItem
              key={a.id}
              account={a}
              onClick={() => (setAccount(a), details.open())}
            />
          ))}
        </div>
      )}
      {details.isOpen && account && (
        <AccountDetails
          account={account}
          onClose={details.close}
          mutate={mutate}
          setAccount={setAccount}
        />
      )}
    </div>
  );
};

export default AccountList;
