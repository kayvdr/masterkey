import { useState } from "react";
import useMatchMedia from "../../hooks/useMatchMedia";
import { UsePaginationReturn } from "../../hooks/usePagination";
import useToggle from "../../hooks/useToggle";
import { Account } from "../../types";
import SvgArrowLeft from "../icons/ArrowLeft";
import SvgArrowRight from "../icons/ArrowRight";
import Icon from "../ui/Icon";
import AccountDetails from "./AccountDetails";
import AccountItem from "./AccountItem";
import styles from "./AccountList.module.css";

interface Props {
  accounts: Account[];
  total: number;
  pagination: UsePaginationReturn;
  isPagination?: boolean;
  mutate: () => void;
}

const AccountList = ({
  accounts,
  total,
  pagination,
  isPagination = true,
  mutate,
}: Props) => {
  const details = useToggle();
  const [account, setAccount] = useState<Account>();
  const matches = useMatchMedia("(max-width: 768px)");

  return (
    <div>
      {total === 0 && <div>No Accounts found</div>}
      {total > 0 && (
        <div className={styles.wrapper}>
          {((matches && !details.isOpen) || !matches) && (
            <div className={styles.list}>
              {accounts.map((a) => (
                <AccountItem
                  key={a.id}
                  account={a}
                  isActive={a === account && details.isOpen}
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
      )}
      {isPagination && (
        <div className={styles.pagination}>
          <button
            className={styles.paginationPrev}
            onClick={pagination.prevPage}
            disabled={pagination.state.page <= 1}
          >
            <Icon glyph={SvgArrowLeft} className={styles.iconPagination} />
          </button>
          <button
            className={styles.paginationNext}
            onClick={pagination.nextPage}
            disabled={pagination.state.limit * pagination.state.page >= total}
          >
            <Icon glyph={SvgArrowRight} className={styles.iconPagination} />
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountList;
