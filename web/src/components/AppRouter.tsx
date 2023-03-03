import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import AddAccountPage from "./AddAccount/AddAccountPage";
import HomePage from "./Home/HomePage";
import ImprintPage from "./Imprint/ImprintPage";
import NotFoundPage from "./NotFound/NotFoundPage";
import SearchPage from "./Search/SearchPage";

const AppRouter = () => (
  <BrowserRouter>
    <ScrollTop />
    <Routes>
      <Route path="/imprint" element={<ImprintPage />} />
      <Route path="/add" element={<AddAccountPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </BrowserRouter>
);

const ScrollTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default AppRouter;
