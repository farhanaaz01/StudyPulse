import { NavLink } from "react-router-dom";

const primaryLinks = [
  { label: "Dashboard", icon: "dashboard", to: "/dashboard" },
  { label: "History", icon: "history", to: "/history" },
  { label: "Analytics", icon: "analytics", to: "/analytics" },
  { label: "Goals", icon: "track_changes", to: "/goals" },
];

const secondaryLinks = [
  { label: "Profile", icon: "account_circle", to: "/profile" },
  { label: "Settings", icon: "settings", to: "/settings" },
];

function Sidebar({ onLogout }) {
  const renderLink = ({ label, icon, to }) => (
    <NavLink
      key={label}
      to={to}
      className={({ isActive }) =>
        `flex items-center border-l-2 px-6 py-3 font-medium transition ${
          isActive
            ? "border-[#b4c5ff] bg-[#b4c5ff]/10 font-bold text-[#b4c5ff]"
            : "border-transparent text-[#c3c6d7] hover:bg-white/5 hover:text-[#dde2f8]"
        }`
      }
    >
      <span className="material-symbols-outlined mr-3">{icon}</span>
      {label}
    </NavLink>
  );

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-[260px] flex-col justify-between border-r border-white/10 bg-[#191f2f]/80 py-6 shadow-xl backdrop-blur-xl md:flex">
        <div>
          <div className="mb-12 px-6">
            <span className="text-2xl font-bold tracking-tight text-[#b4c5ff]">
              StudyPulse
            </span>
          </div>
          <nav className="space-y-1">{primaryLinks.map(renderLink)}</nav>
        </div>

        <nav className="space-y-1">
          {secondaryLinks.map(renderLink)}
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center border-l-2 border-transparent px-6 py-3 text-left font-medium text-[#ffb4ab] transition hover:bg-white/5"
          >
            <span className="material-symbols-outlined mr-3">logout</span>
            Logout
          </button>
        </nav>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-around border-t border-white/5 bg-[#191f2f]/90 px-6 py-3 backdrop-blur-xl md:hidden">
        {primaryLinks.map(({ label, icon, to }) => (
          <NavLink
            key={label}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center text-[10px] ${
                isActive ? "text-[#b4c5ff]" : "text-[#c3c6d7]"
              }`
            }
          >
            <span className="material-symbols-outlined">{icon}</span>
            <span className="mt-1">{label}</span>
          </NavLink>
        ))}
        <button
          type="button"
          onClick={onLogout}
          className="flex flex-col items-center text-[10px] text-[#ffb4ab]"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="mt-1">Logout</span>
        </button>
      </nav>
    </>
  );
}

export default Sidebar;
