import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
// import AdminPanel from "../src/component/Admin/AdminPanel.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
   <App />
  </BrowserRouter>
);