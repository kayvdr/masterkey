import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./Home/HomePage";
import ImprintPage from "./Imprint/ImprintPage";
import SearchPage from "./Search/SearchPage";

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/imprint" element={<ImprintPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/" element={<HomePage />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
