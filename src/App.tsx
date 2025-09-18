import { Route, Routes } from "react-router";
import LogInPage from "./Pages/LogInPage";
import RegisterPage from "./Pages/RegisterPage";

function App() {
  return (
      <Routes>
        <Route path="/" element={<LogInPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
  );
}

export default App;
