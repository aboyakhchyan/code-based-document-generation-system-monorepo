import React from "react";

interface IDashboardContent {
  children: React.ReactNode;
}

export const DashboardContent: React.FC<IDashboardContent> = ({ children }) => {
  return (
    <div
      className="flex flex-col flex-1 overflow-auto"
      style={{
        scrollbarWidth: "none", 
      }}
    >
      {children}
    </div>
  );
};
