import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import router from "./route";
import { RouterProvider } from "react-router-dom";
import AuthProvider from "@components/common/AuthProvider";
import { TooltipProvider } from "@components/ui";
import { QueryProvider } from "@/configs/react-query";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>
      <AuthProvider>
        <TooltipProvider>
          <RouterProvider router={router} />
        </TooltipProvider>
      </AuthProvider>
    </QueryProvider>
  </StrictMode>
);
