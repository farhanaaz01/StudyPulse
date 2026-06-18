import { useCallback, useEffect, useState } from "react";
import DashboardCards from "../components/DashboardCards";
import StudyTimer from "../components/StudyTimer";
import WeeklySummary from "../components/WeeklySummary";

function Dashboard() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({
    todayTime: 0,
    weekTime: 0,
    totalSessions: 0,
  });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
console.log("TOKEN =", token);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const fetchDashboardData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const [statsResponse, subjectsResponse] = await Promise.all([
        fetch("http://localhost:8080/api/dashboard/stats", { headers }),
        fetch("http://localhost:8080/api/subjects", { headers }),
      ]);

      if (!statsResponse.ok || !subjectsResponse.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const [stats, subjectList] = await Promise.all([
        statsResponse.json(),
        subjectsResponse.json(),
      ]);

      setDashboardStats(stats);
      setSubjects(subjectList);
      setSelectedSubject((current) => current || subjectList[0] || null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchDashboardData();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [fetchDashboardData]);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-4 sm:px-6">
      <DashboardCards
        todayTime={loading ? "..." : formatTime(dashboardStats.todayTime)}
        weekTime={loading ? "..." : formatTime(dashboardStats.weekTime)}
        streak="—"
        totalSessions={loading ? "..." : dashboardStats.totalSessions}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <StudyTimer selectedSubject={selectedSubject} onSessionStopped={fetchDashboardData} />

          <section className="glass-card rounded-xl p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold text-[#dde2f8]">Select Subject</h2>
              <span className="text-sm text-[#c3c6d7]">{subjects.length} available</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {subjects.length > 0 ? (
                subjects.map((subject) => {
                  const isActive = selectedSubject?.id === subject.id;
                  return (
                    <button
                      key={subject.id}
                      type="button"
                      onClick={() => setSelectedSubject(subject)}
                      className={`rounded-lg border px-4 py-2 font-medium transition ${
                        isActive
                          ? "border-[#b4c5ff]/50 bg-[#b4c5ff]/20 text-[#b4c5ff]"
                          : "border-white/5 bg-[#191f2f] text-[#c3c6d7] hover:border-[#b4c5ff]/20 hover:text-[#dde2f8]"
                      }`}
                    >
                      {subject.name}
                    </button>
                  );
                })
              ) : (
                <p className="text-sm text-[#c3c6d7]">
                  No subjects available. Add one through your connected StudyPulse client.
                </p>
              )}
            </div>
          </section>
        </div>

        <div className="lg:col-span-4">
          <WeeklySummary data={[]} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
