import React from "react";
import ReactDOM from "react-dom/client";
import "./i18n";
import { Provider } from "react-redux";
import { store } from "./redux/store/store";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
// Mounts app with Redux provider at root node.
root.render(
  <Provider store={store}>
    <App />
  </Provider>,
);

// Optional performance reporting hook.
reportWebVitals();
