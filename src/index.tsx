import ReactDOM from "react-dom";
import { App } from "./App";
import React from "react";
import { configureAxiosInterceptors } from "./api/client";
import state from "./state";
import { initI18N } from "./i18n";
import "./logging"

configureAxiosInterceptors(state);
initI18N();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("app")
);
