import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import "./styles/global.css";
import { RouterProvider } from "react-router-dom";
import { router } from "../src/routes/router.jsx";
import ContextProvider from "./context/ContextProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ContextProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <RouterProvider router={router} />
      </Suspense>
    </ContextProvider>
  </StrictMode>,
);
