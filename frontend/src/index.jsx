import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import Homepage from "./component/HomePage";
import SplashScreen from "./component/SplashScreen"

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
<<<<<<< HEAD
    {/* <App /> */}
    {/* <Homepage /> */}
    <SplashScreen />
=======
   <App />
>>>>>>> b67bd94786c28c0718323bfb66d963cfe4bbbeec
  </BrowserRouter>
);