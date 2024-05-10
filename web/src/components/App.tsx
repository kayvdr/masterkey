import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../context/authContext";
import ScrollTop from "../hooks/useScrollTop";
import styles from "./App.module.css";
import AppRouter from "./AppRouter";

const App = () => (
  <BrowserRouter>
    <ScrollTop />
    <AuthProvider>
      <div className={styles.app}>
        <AppRouter />
      </div>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
