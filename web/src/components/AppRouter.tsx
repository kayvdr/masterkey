import { BrowserRouter, Route, Routes } from "react-router-dom";
import AddAccountPage from "./AddAccount/AddAccountPage";
import HomePage from "./Home/HomePage";
import ImprintPage from "./Imprint/ImprintPage";
import NotFoundPage from "./NotFound/NotFoundPage";
import SearchPage from "./Search/SearchPage";

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/imprint" element={<ImprintPage />} />
      <Route path="/add" element={<AddAccountPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
