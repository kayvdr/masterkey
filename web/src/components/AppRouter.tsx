import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../context/authContext";
import AddAccountPage from "./Account/AddAccountPage";
import EditAccountPage from "./Account/EditAccountPage";
import Accounts from "./Accounts/AccountsPage";
import LoginPage from "./Auth/LoginPage";
import RegisterPage from "./Auth/RegisterPage";
import HomePage from "./Home/HomePage";
import ImprintPage from "./Imprint/ImprintPage";
import PrivacyPage from "./Privacy/PrivacyPage";
import Profile from "./Profile/Profile";
import SearchPage from "./Search/SearchPage";
import Votes from "./Votes/VotesPage";

const AppRouter = () => (
  <Routes>
    <Route path="/*" element={<SessionRouter />} />
    <Route path="privacy" element={<PrivacyPage />} />
    <Route path="imprint" element={<ImprintPage />} />
    <Route path="search" element={<SearchPage />} />
    <Route path="/" index element={<HomePage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

const SessionRouter = () => {
  const { session } = useAuth();

  if (session === undefined) return null;

  return (
    <>
      {session ? (
        <Routes>
          <Route path="add" element={<AddAccountPage />} />
          <Route path="edit" element={<EditAccountPage />} />
          <Route path="profile" index element={<Profile />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="votes" element={<Votes />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="register" element={<RegisterPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </>
  );
};

export default AppRouter;
