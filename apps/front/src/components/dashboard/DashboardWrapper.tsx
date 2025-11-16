import React from "react";

interface IDashboardWrapper {
  children: React.ReactNode;
}

export const DashboardWrapper: React.FC<IDashboardWrapper> = ({
  children,
}) => {
  return <main className="flex flex-row h-screen overflow-hidden">{children}</main>;
};
