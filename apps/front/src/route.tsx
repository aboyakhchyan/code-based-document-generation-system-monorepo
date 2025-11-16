import { createBrowserRouter, Navigate } from "react-router-dom";
import { Applications, ErrorBoundary, NotFound, Profile, SignIn, SignUp, Verification } from "@/pages";
import { Dashboard, PublicLayout } from "@/layouts";
import { ResumeCreator } from "./pages/ResumeCreator";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="login" replace />,
      },
      {
        path: "login",
        element: <SignIn />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "register",
        element: <SignUp />,
        errorElement: <ErrorBoundary />,
      },
    ],
  },
  {
    path: "verification",
    element: <Verification />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "dashboard",
    element: <Dashboard />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Navigate to="profile" replace />,
      },

      {
        path: "applications",
        element: <Applications />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "create/cv",
        element: <ResumeCreator />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
    errorElement: <ErrorBoundary />,
  },
]);

export default router;
