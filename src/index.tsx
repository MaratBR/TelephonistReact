import ReactDOM from "react-dom";
import { App } from "./App";
import React from "react";
import { configureAxiosInterceptors } from "./api/client";
import state from "./state";

configureAxiosInterceptors(state);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("app")
);
