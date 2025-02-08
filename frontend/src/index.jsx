import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import Homepage from "./component/HomePage";
import SplashScreen from "./component/SplashScreen"

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    {/* <App /> */}
    {/* <Homepage /> */}
    <SplashScreen />
  </BrowserRouter>
);