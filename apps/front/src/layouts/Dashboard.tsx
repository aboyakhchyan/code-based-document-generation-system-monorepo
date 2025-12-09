import { VerticalNavBar } from "@/components/common";
import { DashboardContainer, DashboardWrapper } from "@/components/dashboard";
import { Spinner } from "@/components/ui";
import { useAuth } from "@/hooks";
import React, { useState, type Dispatch, type SetStateAction } from "react";
import { Navigate, Outlet } from "react-router-dom";

export interface IOutletContext {
  navOpen: boolean;
  isTemplatesModalOpen: boolean;
  setIsTemplatesModalOpen: Dispatch<SetStateAction<boolean>>;
}

const Dashboard: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState<boolean>(false);
  const [navOpen, setNavOpen] = useState(true);

  if (isLoading) return <Spinner fullScreen={true} />;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <DashboardWrapper>
      <VerticalNavBar navOpen={navOpen} onToggle={setNavOpen} onSetIsTemplatesModalOpen={setIsTemplatesModalOpen}/>
      <DashboardContainer navOpen={navOpen}>
        <Outlet context={{ navOpen, isTemplatesModalOpen, setIsTemplatesModalOpen }} />
      </DashboardContainer>
    </DashboardWrapper>
  );
};

export default Dashboard;
