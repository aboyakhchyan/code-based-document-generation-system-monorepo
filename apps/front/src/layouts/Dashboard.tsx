import { VerticalNavBar } from "@/components/common";
import { DashboardContainer, DashboardWrapper } from "@/components/dashboard";
import React, { useState } from "react";
import { Outlet } from "react-router-dom";

export const Dashboard: React.FC = () => {
  const [navOpen, setNavOpen] = useState<boolean>(true);
  return (
    <DashboardWrapper>
      <VerticalNavBar navOpen={navOpen} onToggle={setNavOpen} />
      <DashboardContainer navOpen={navOpen}>
        <Outlet />
      </DashboardContainer>
    </DashboardWrapper>
  );
};
