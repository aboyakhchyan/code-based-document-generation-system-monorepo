import { createBrowserRouter, Navigate } from "react-router-dom";
import {
  ErrorBoundary,
  MyDocuments,
  NotFound,
  PaymentStatus,
  Profile,
  SignIn,
  SignUp,
  TransactionHistory,
  Verification,
} from "@/pages";
import { ResumeCreator } from "./pages/DocumentCreator";
import { lazy } from "react";

const Dashboard = lazy(() => import("@/layouts/Dashboard"));
const PublicLayout = lazy(() => import("@/layouts/PublicLayout"));

export const createRouter = () => {
  return createBrowserRouter([
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
      path: "payment",
      element: <PaymentStatus />,
      errorElement: <ErrorBoundary />,
    },
    {
      path: "dashboard",
      element: <Dashboard />,
      // errorElement: <ErrorBoundary />,
      children: [
        {
          index: true,
          element: <Navigate to="profile" replace />,
        },
        {
          path: "profile",
          element: <Profile />,
        },
        {
          path: "create/document",
          element: <ResumeCreator />,
        },
        {
          path: "my/documents",
          element: <MyDocuments />,
        },
        {
          path: "transaction/history",
          element: <TransactionHistory />,
        },
      ],
    },
    {
      path: "*",
      element: <NotFound />,
      errorElement: <ErrorBoundary />,
    },
  ]);
};
