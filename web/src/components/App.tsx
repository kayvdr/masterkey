import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../context/authContext";
import NotificationContext, {
  useNotification,
} from "../context/notificationContext";
import ScrollTop from "../hooks/useScrollTop";
import styles from "./App.module.css";
import AppRouter from "./AppRouter";
import CookieComponent from "./CookieComponent";
import Notification from "./ui/Notification";

const App = () => {
  const [{ show, severity, message }, dispatch] = useNotification();

  return (
    <BrowserRouter>
      <ScrollTop />
      <CookieComponent />
      <AuthProvider>
        <div className={styles.app}>
          <NotificationContext.Provider value={dispatch}>
            <AppRouter />
            {show && <Notification type={severity} text={message} />}
          </NotificationContext.Provider>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
