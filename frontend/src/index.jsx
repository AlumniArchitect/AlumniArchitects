import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import AdminPanel from "./component/Admin/AdminPanel";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
   <App />
  </BrowserRouter>
);