import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/variables.css";
import "./styles/global.css";
import "./styles/layout.css";
import "./styles/header.css";
import "./styles/navigation.css";
import "./styles/panels.css";
import "./styles/tables.css";
import "./styles/forms.css";
import "./styles/modal.css";
import "./styles/responsive.css";
import "./styles/help.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
