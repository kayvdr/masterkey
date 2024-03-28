import { Session } from "@supabase/supabase-js";
import { createContext } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import ScrollTop from "../hooks/useScrolltop";
import AddAccountPage from "./Account/AddAccountPage";
import EditAccountPage from "./Account/EditAccountPage";
import LoginPage from "./Auth/LoginPage";
import RegisterPage from "./Auth/RegisterPage";
import HomePage from "./Home/HomePage";
import ImprintPage from "./Imprint/ImprintPage";
import NotFoundPage from "./NotFound/NotFoundPage";
import PrivacyPage from "./Privacy/PrivacyPage";
import DashboardPage from "./Profile/Profile";
import SearchPage from "./Search/SearchPage";
import SharedAccounts from "./SharedAccounts/SharedAccountsPage";

export const SessionContext = createContext<Session | null>(null);

const AppRouter = () => {
  const { session } = useAuth();

  return (
    <BrowserRouter>
      <ScrollTop />
      <SessionContext.Provider value={session}>
        <Routes>
          {session && (
            <>
              <Route path="/youraccounts" element={<SharedAccounts />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            </>
          )}
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/imprint" element={<ImprintPage />} />
          <Route path="/add" element={<AddAccountPage />} />
          <Route path="/edit" element={<EditAccountPage />} />
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
