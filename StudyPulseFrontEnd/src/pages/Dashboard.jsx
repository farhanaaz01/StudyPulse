import { useCallback, useEffect, useMemo, useState } from "react";
import DashboardCards from "../components/DashboardCards";
import GoalsSnapshot from "../components/GoalsSnapshot";
import StudyTimer from "../components/StudyTimer";
import WeeklySummary from "../components/WeeklySummary";
import { fetchDashboardDataApi } from "../api/dashboardApi";
import { getGoalsApi } from "../api/goalApi";
import { createSubjectApi } from "../api/subjectApi";
import { formatDuration, formatStreak } from "../utils/formatTime";
import { getApiErrorMessage, isDuplicateSubjectError } from "../utils/apiError";
import { subscribeSessionStopped } from "../utils/timerEvents";
import { getWeeklyGoalTargetSeconds } from "../utils/goalUtils";

function Dashboard() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({
    todayTime: 0,
    weekTime: 0,
    totalSessions: 0,
  });
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [subjectName, setSubjectName] = useState("");
  const [weeklyData, setWeeklyData] = useState([]);
  const [streak, setStreak] = useState(0);
  const [goals, setGoals] = useState([]);
  const [goalsLoading, setGoalsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [subjectError, setSubjectError] = useState("");

  const fetchDashboardData = useCallback(async () => {
    try {
      setError("");
      setGoalsLoading(true);

      const [[statsRes, subjectsRes, streakRes, weeklyRes], goalsRes] =
        await Promise.all([fetchDashboardDataApi(), getGoalsApi()]);

      const stats = statsRes.data;
      const subjectList = subjectsRes.data;
      const streakData = streakRes.data;
      const weekly = weeklyRes.data;

      setDashboardStats(stats);
      setSubjects(subjectList);
      setWeeklyData(weekly);
      setStreak(streakData.streak ?? 0);
      setGoals(goalsRes.data);
      setSelectedSubject((current) => current || subjectList[0] || null);
    } catch (err) {
      console.error(err);
      setError("Unable to load dashboard data. Please refresh the page.");
    } finally {
      setLoading(false);
      setGoalsLoading(false);
    }
  }, []);

  const weeklyGoalTargetSeconds = useMemo(
    () => getWeeklyGoalTargetSeconds(goals),
    [goals]
  );

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    return subscribeSessionStopped(fetchDashboardData);
  }, [fetchDashboardData]);

  const handleCreateSubject = async () => {
    if (!subjectName.trim()) return;

    setSubjectError("");

    try {
      await createSubjectApi(subjectName.trim());
      setSubjectName("");
      setShowSubjectModal(false);
      await fetchDashboardData();
    } catch (err) {
      if (isDuplicateSubjectError(err)) {
        setSubjectError(
          getApiErrorMessage(err, "Subject already exists")
        );
        return;
      }

      setSubjectError(getApiErrorMessage(err, "Failed to create subject"));
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-4 sm:px-6">
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-[#ffb4ab]/30 bg-[#ffb4ab]/10 px-4 py-3 text-sm text-[#ffb4ab]"
        >
          {error}
        </div>
      )}

      <DashboardCards
        todayTime={loading ? "..." : formatDuration(dashboardStats.todayTime)}
        weekTime={loading ? "..." : formatDuration(dashboardStats.weekTime)}
        streak={loading ? "..." : formatStreak(streak)}
        totalSessions={loading ? "..." : dashboardStats.totalSessions}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <StudyTimer
            selectedSubject={selectedSubject}
            onSessionStopped={fetchDashboardData}
          />

          <section className="glass-card rounded-xl p-6">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold text-[#dde2f8]">
                Select Subject
              </h2>

              <div className="flex items-center gap-3">
                <span className="text-sm text-[#c3c6d7]">
                  {subjects.length} available
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSubjectError("");
                    setShowSubjectModal(true);
                  }}
                  className="rounded-lg bg-[#b4c5ff] px-4 py-2 text-sm font-semibold text-[#00174b] transition hover:bg-[#2563eb] hover:text-white"
                >
                  + Add Subject
                </button>
              </div>
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
                  No subjects yet. Click &quot;+ Add Subject&quot; to create your
                  first one.
                </p>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-6 lg:col-span-4">
          <WeeklySummary
            data={weeklyData}
            weeklyGoalSeconds={weeklyGoalTargetSeconds}
          />
          <GoalsSnapshot goals={goals} loading={goalsLoading} />
        </div>
      </div>

      {showSubjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-xl bg-[#151b2b] p-6">
            <h2 className="mb-4 text-xl font-semibold text-white">
              Create Subject
            </h2>

            {subjectError && (
              <p className="mb-4 rounded-lg border border-[#ffb4ab]/30 bg-[#ffb4ab]/10 px-3 py-2 text-sm text-[#ffb4ab]">
                {subjectError}
              </p>
            )}

            <input
              type="text"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="e.g. Java, DSA, Mathematics"
              className="mb-4 w-full rounded-lg border border-white/10 bg-[#0d1322] px-4 py-3 text-white placeholder-[#8d90a0] focus:border-[#b4c5ff]/50 focus:outline-none"
            />

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowSubjectModal(false);
                  setSubjectError("");
                }}
                className="rounded-lg border border-white/10 px-4 py-2 text-white"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleCreateSubject}
                className="rounded-lg bg-[#b4c5ff] px-4 py-2 font-semibold text-[#00174b]"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
