import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../context/authContext";
import AddAccountPage from "./Account/AddAccountPage";
import EditAccountPage from "./Account/EditAccountPage";
import Accounts from "./Accounts/AccountsPage";
import LoginPage from "./Auth/LoginPage";
import RegisterPage from "./Auth/RegisterPage";
import HomePage from "./Home/HomePage";
import ImprintPage from "./Imprint/ImprintPage";
import NotFoundPage from "./NotFound/NotFoundPage";
import PrivacyPage from "./Privacy/PrivacyPage";
import Profile from "./Profile/Profile";
import SearchPage from "./Search/SearchPage";
import Votes from "./Votes/VotesPage";

const AppRouter = () => {
  const { session } = useAuth();

  return (
    <Routes>
      {session && (
        <>
          <Route path="/profile" element={<Profile />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/votes" element={<Votes />} />
        </>
      )}
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/imprint" element={<ImprintPage />} />
      <Route
        path="/add"
        element={
          session ? <AddAccountPage /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/edit"
        element={
          session ? <EditAccountPage /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/register"
        element={
          session ? <Navigate to="/profile" replace /> : <RegisterPage />
        }
      />
      <Route
        path="/login"
        element={session ? <Navigate to="/profile" replace /> : <LoginPage />}
      />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRouter;
