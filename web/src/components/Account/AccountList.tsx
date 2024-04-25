import classNames from "classnames";
import { useRef, useState } from "react";
import useMatchMedia from "../../hooks/useMatchMedia";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
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
  const wrapperRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(wrapperRef, details.close);
  const matches = useMatchMedia("(max-width: 768px)");

  const pages = total && Math.ceil(total / pagination.state.limit);

  return (
    <div>
      {total === 0 && <div>No Items found</div>}
      {total > 0 && (
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
          {[...Array(pages).keys()].map((p) => (
            <button
              className={classNames(styles.paginationBtn, {
                [styles.paginationActive]: pagination.state.page === p + 1,
              })}
              onClick={() => pagination.setPage(p + 1)}
              key={p}
            >
              {p + 1}
            </button>
          ))}
          <button
            className={styles.paginationNext}
            onClick={pagination.nextPage}
            disabled={
              pagination.state.limit * pagination.state.page >= (total ?? 0)
            }
          >
            <Icon glyph={SvgArrowRight} className={styles.iconPagination} />
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountList;
