import { Route, Routes } from "react-router";
import LogInPage from "./Pages/LogInPage";
import RegisterPage from "./Pages/RegisterPage";
import MainPage from "./Pages/MainPage";
import ProductPage from "./Pages/ProductPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/login" element={<LogInPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/product/:id" element={<ProductPage />} />
    </Routes>
  );
}

export default App;
