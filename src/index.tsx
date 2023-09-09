import React from "react";
import ReactDOM from "react-dom/client";
import { MainGrid } from "./MainGrid/MainGrid.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MainGrid />
  </React.StrictMode>
);
