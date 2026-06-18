import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

function AppLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#0d1322] text-[#dde2f8]">
      <Sidebar onLogout={handleLogout} />
      <main className="min-h-screen pb-24 md:ml-[260px] md:pb-0">
        {pathname !== "/goals" && <Header />}
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
