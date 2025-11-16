import type { IApplication } from "@/types";
import React from "react";
import { ApplicationItem } from "./ApplicationItem";

interface IApplicationsGridProps {
  applications: IApplication[];
}

export const ApplicationsGrid: React.FC<IApplicationsGridProps> = ({
  applications,
}) => {
  return (
    <div className="flex flex-col gap-5">
      {applications.length !== 0 &&
        applications.map((application) => (
          <ApplicationItem key={application.id} {...application} />
        ))}
    </div>
  );
};
