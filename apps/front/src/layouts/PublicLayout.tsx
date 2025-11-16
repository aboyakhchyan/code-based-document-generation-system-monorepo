import { Button } from "@/components/ui";
import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export const PublicLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <main className="relative flex flex-col justify-center items-center h-screen">
      <div className="w-full max-w-md bg-white shadow-md rounded-2xl p-8">
        <Outlet />
      </div>

      <div className="flex gap-4 mt-4">
        {pathname.startsWith("/register") ? (
          <p className="text-sm">
            Արդեն ունե՞ք հաշիվ։
            <Button variant="link" size="md" onClick={() => navigate("/login")}>
              Մուտք
            </Button>
          </p>
        ) : (
          <Button variant="link" size="md" onClick={() => navigate(`/register?user-type=user`)}>
            Գրանցում
          </Button>
        )}
      </div>
    </main>
  );
};
