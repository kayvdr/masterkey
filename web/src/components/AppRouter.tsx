import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Home/Home";
import SearchPage from "./Search/SearchPage";

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/search" element={<SearchPage />} />
      <Route path="/" element={<Home />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
