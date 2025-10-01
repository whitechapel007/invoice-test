import { useAuth } from "../../context/AuthContext";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Outlet } from "react-router-dom";

const DashboardWrapper = () => {
  const { user } = useAuth();

  return (
    <div className="md:flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto bg-gray-200 md:ml-64 ">
        <div className="max-w-[1080px] mx-auto">
          <div className="hidden md:block ">
            <Header user={user} />
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardWrapper;
