import { ApplicationsGrid } from "@/components/applications/ApplicationsGrid";
import { DashboardContent, DashboardHeader } from "@/components/dashboard";
import { Input } from "@/components/ui";
import { applications } from "@/constants/applications";
import { MailPlus, Search } from "lucide-react";
import React from "react";

export const Applications: React.FC = () => {
  return (
    <React.Fragment>
      <DashboardHeader>
        <div className="w-1/3">
          <div className="flex flex-row gap-5 font-bold text-primary-800 p-5">
            <MailPlus size={50} />
            <div className="flex flex-col justify-between">
              <h1>Դասընթացներ</h1>
              <p className="text-sm font-light">
                Ընդհանուր քանակը: {applications.length}
              </p>
            </div>
          </div>
        </div>
        <div className="w-1/3">
          <Input
            placeholder="Հայտերի որոնում"
            icon={<Search className="text-primary-800" />}
            className="placeholder-primary-800 border-primary-800"
          />
        </div>
      </DashboardHeader>
      <DashboardContent>
        <ApplicationsGrid applications={applications} />
      </DashboardContent>
    </React.Fragment>
  );
};
