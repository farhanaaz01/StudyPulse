import { useLocation } from "react-router-dom";

function Header({
  title,
  subtitle,
  userName = "Student",
  userRole = "Focused learner",
}) {
  const { pathname } = useLocation();
  const isHistory = pathname === "/history";
  const isAnalytics = pathname === "/analytics";
  const isGoals = pathname === "/goals";
  const isProfile = pathname === "/profile";
  const displayTitle = title || (
    isHistory
      ? "Study History"
      : isAnalytics
        ? "Study Analytics"
        : isGoals
          ? "Study Goals"
          : isProfile
            ? "Profile"
            : "Dashboard"
  );
  const displaySubtitle = subtitle || (
    isHistory
      ? "Review every completed session and study pattern."
      : isAnalytics
      ? "Understand your focus patterns and progress."
      : isGoals
        ? "Precision tracking for your academic excellence."
        : isProfile
          ? "Your StudyPulse account and learning totals."
          : "Track your study time and progress."
  );

  return (
    <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#dde2f8] md:text-3xl">{displayTitle}</h1>
        <p className="text-sm text-[#c3c6d7]">{displaySubtitle}</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden flex-col items-end sm:flex">
          <span className="text-sm font-semibold text-[#dde2f8]">{userName}</span>
          <span className="text-xs text-[#c3c6d7]">{userRole}</span>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#b4c5ff]/20 bg-[#242a3a] text-[#b4c5ff] shadow-lg">
          <span className="material-symbols-outlined">person</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
