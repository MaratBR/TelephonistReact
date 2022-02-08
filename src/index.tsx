import ReactDOM from "react-dom";
import { App } from "./App";
import React from "react";
import { configureAxiosInterceptors } from "./api/client";
import state from "./state";
import { initI18N } from "./i18n";
import "./logging";
import "./styles/index.scss";

configureAxiosInterceptors(state);
initI18N();

if (!(window as any).__APP_INITIALIZED) {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById("app")
  );
  (window as any).__APP_INITIALIZED = true;
}
