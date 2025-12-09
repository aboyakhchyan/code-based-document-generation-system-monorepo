import { Button, DynamicImage, Spinner } from "@/components/ui";
import React from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import DocBoxdIcon from "@assets/icons/DocBoxdWhite.png";
import { useAuth } from "@/hooks";

const PublicLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Spinner fullScreen={true} />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return (
    <main className="relative flex flex-row h-screen">
      <div className="flex items-center justify-center w-1/2 bg-primary-800 max-md:hidden">
        <div className="flex flex-col items-center justify-center">
          <DynamicImage className="w-20 h-20" src={DocBoxdIcon} alt="DocBoxd" />
          <h1 className="text-xl font-urbanist font-bold text-white">DocBoxd</h1>
        </div>
      </div>

      <div className="max-md:w-full md:w-1/2 flex justify-center items-center">
        <div className="shadow-md rounded-2xl p-8">
          <Outlet />
          <div className="flex justify-center gap-4 mt-4">
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
        </div>
      </div>
    </main>
  );
};

export default PublicLayout;
