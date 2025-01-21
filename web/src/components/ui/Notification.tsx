import classNames from "classnames";
import { PropsWithChildren, useContext, useEffect, useState } from "react";
import NotificationContext, {
  hideNotification,
} from "../../context/notificationContext";
import SvgCheck from "../icons/Check";
import SvgClose from "../icons/Close";
import SvgError from "../icons/Error";
import Icon from "./Icon";
import styles from "./Notification.module.css";

type Props = PropsWithChildren<{
  type: "success" | "error";
  text: string;
}>;

const Notification = ({ type, text }: Props) => {
  const [mounted, setMounted] = useState(false);
  const [close, setClose] = useState(false);
  const dispatch = useContext(NotificationContext);

  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timeout);
  });

  useEffect(() => {
    const timeout = setTimeout(() => setClose(true), 5000);
    return () => clearTimeout(timeout);
  });

  return (
    <div
      className={classNames(styles.notification, {
        [styles.notificationSuccess]: type === "success",
        [styles.notificationError]: type === "error",
        [styles.notificationShown]: mounted && !close,
      })}
      onTransitionEnd={() => {
        if (close) dispatch(hideNotification());
      }}
    >
      <div className={styles.wrapper}>
        <Icon
          className={classNames(styles.notificationIcon, {
            [styles.notificationIconSuccess]: type === "success",
            [styles.notificationIconError]: type === "error",
          })}
          glyph={{ error: SvgError, success: SvgCheck }[type]}
        />
        <div className={styles.text}>{text}</div>
        <button
          type="button"
          className={styles.btnClose}
          onClick={() => setClose(true)}
        >
          <Icon className={styles.btnCloseIcon} glyph={SvgClose} />
        </button>
      </div>
    </div>
  );
};

export default Notification;
