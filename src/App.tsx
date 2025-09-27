import { Route, Routes } from "react-router";
import LogInPage from "./Pages/LogInPage";
import RegisterPage from "./Pages/RegisterPage";
import MainPage from "./Pages/MainPage";
import ProductPage from "./Pages/ProductPage";
import Checkout from "./Pages/Checkout";
import { CartProvider } from "./context/CartContext";
import SuccessPage from "./Pages/SuccessPage";

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LogInPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<SuccessPage />} />
      </Routes>
    </CartProvider>
  );
}

export default App;
