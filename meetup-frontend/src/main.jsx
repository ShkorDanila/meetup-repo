import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AuthProvider from "./providers/AuthProvider.jsx";
import ApiProvider from "./providers/ApiProvider.jsx";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { CookiesProvider } from "react-cookie";

import "@fontsource-variable/overpass";
import { IndexProvider } from "./providers/IndexProvider.jsx";

const router = createRouter({ routeTree });

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <IndexProvider>
      <RouterProvider router={router} />
    </IndexProvider>
  </StrictMode>
);
