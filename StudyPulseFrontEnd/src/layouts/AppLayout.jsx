import { Outlet, useLocation, useNavigate } from "react-router-dom";
import GlobalTimerBar from "../components/GlobalTimerBar";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { stopSessionApi } from "../api/sessionApi";
import {
  calcElapsedSeconds,
  clearTimerStorage,
  getActiveSessionId,
  getInitialTimerStatus,
} from "../utils/timerStorage";
import { dispatchSessionStopped } from "../utils/timerEvents";

function AppLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = async () => {
    const activeSessionId = getActiveSessionId();

    if (activeSessionId) {
      try {
        const elapsed = calcElapsedSeconds(getInitialTimerStatus() === "paused");
        await stopSessionApi(activeSessionId, elapsed);
        dispatchSessionStopped();
      } catch (error) {
        console.error("Failed to stop session on logout:", error);
      }
    }

    clearTimerStorage();
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
      <GlobalTimerBar />
    </div>
  );
}

export default AppLayout;
