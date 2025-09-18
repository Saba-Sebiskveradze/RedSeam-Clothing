import { createRoot } from "react-dom/client";
import "./index.css";
import { HashRouter as Router } from "react-router";

import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <Router>
    <App />
  </Router>
);
