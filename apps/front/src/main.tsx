import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createRouter } from "./route";
import { RouterProvider } from "react-router-dom";
import AuthProvider from "@components/common/AuthProvider";
import { Toaster, TooltipProvider } from "@components/ui";
import { QueryProvider } from "@/configs/react-query";

const App = () => {
  const router = createRouter();

  return (
    <QueryProvider>
      <AuthProvider>
        <TooltipProvider>
          <RouterProvider router={router} />
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryProvider>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
