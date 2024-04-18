import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../context/authContext";
import styles from "./App.module.css";
import AppRouter from "./AppRouter";

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <div className={styles.app}>
        <AppRouter />
      </div>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
