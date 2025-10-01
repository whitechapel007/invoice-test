import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../common/Spinner"; // Assume you have a Spinner component

interface ProtectedRouteProps {
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  redirectPath = "/login",
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    // Show a loading spinner while checking auth status
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    // Redirect to the login page if not authenticated
    return <Navigate to={redirectPath} replace />;
  }

  // Render the child routes/component if authenticated
  return <Outlet />;
};

export default ProtectedRoute;
