import { Session } from "@supabase/supabase-js";
import { createContext } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AddAccountPage from "./AddAccount/AddAccountPage";
import LoginPage from "./Auth/LoginPage";
import RegisterPage from "./Auth/RegisterPage";
import DashboardPage from "./Dashboard/DashboardPage";
import HomePage from "./Home/HomePage";
import useAuth from "./hooks/useAuth";
import ScrollTop from "./hooks/useScrolltop";
import ImprintPage from "./Imprint/ImprintPage";
import NotFoundPage from "./NotFound/NotFoundPage";
import PrivacyPage from "./Privacy/PrivacyPage";
import SearchPage from "./Search/SearchPage";
import SharedAccounts from "./SharedAccounts/SharedAccountsPage";

export const SessionContext = createContext<Session | null>(null);

const AppRouter = () => {
  const { loaded, session } = useAuth();

  if (!loaded) return null;

  return (
    <BrowserRouter>
      <ScrollTop />
      <SessionContext.Provider value={session}>
        <Routes>
          <Route
            path="/youraccounts"
            element={
              session ? <SharedAccounts /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/dashboard"
            element={
              session ? <DashboardPage /> : <Navigate to="/login" replace />
            }
          />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/imprint" element={<ImprintPage />} />
          <Route path="/add" element={<AddAccountPage />} />
          <Route
            path="/register"
            element={
              session ? <Navigate to="/dashboard" replace /> : <RegisterPage />
            }
          />
          <Route
            path="/login"
            element={
              session ? <Navigate to="/dashboard" replace /> : <LoginPage />
            }
          />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </SessionContext.Provider>
    </BrowserRouter>
  );
};

export default AppRouter;
