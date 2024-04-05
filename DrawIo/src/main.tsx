import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { Store } from "@reduxjs/toolkit";
import { store } from "./store/store.tsx";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store as Store}>
    <App />
  </Provider>
);
