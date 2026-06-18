import { useCallback, useEffect, useMemo, useState } from "react";
import { getHistoryApi } from "../api/sessionApi";
import AnalyticsCards from "../components/AnalyticsCards";
import StudyTrendChart from "../components/StudyTrendChart";
import SubjectPieChart from "../components/SubjectPieChart";

const formatDuration = (seconds = 0) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

const getSessionSeconds = (session) => Number(session.durationSeconds ?? session.duration ?? 0);
const getSessionSubject = (session) => session.subjectName ?? session.subject ?? "General";
const getSessionDate = (session) => {
  const value = session.date ?? session.createdAt ?? "";
  return new Date(value.includes("T") ? value : `${value}T00:00:00`);
};

function Analytics() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("week");

  const fetchSessions = useCallback(async () => {
    try {
      const response = await getHistoryApi();
      setSessions(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(fetchSessions, 0);
    return () => clearTimeout(timeoutId);
  }, [fetchSessions]);

  const analytics = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - 6);

    const subjectTotals = new Map();
    const monthlyTotals = Array.from({ length: 12 }, () => 0);
    const dailyTotals = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + index);
      return { date, seconds: 0 };
    });

    let totalSeconds = 0;
    let monthSeconds = 0;
    let longestSeconds = 0;

    sessions.forEach((session) => {
      const seconds = getSessionSeconds(session);
      const subject = getSessionSubject(session);
      const date = getSessionDate(session);
      if (Number.isNaN(date.getTime())) return;

      totalSeconds += seconds;
      longestSeconds = Math.max(longestSeconds, seconds);
      subjectTotals.set(subject, (subjectTotals.get(subject) || 0) + seconds);

      if (date.getFullYear() === now.getFullYear()) {
        monthlyTotals[date.getMonth()] += seconds;
      }
      if (date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()) {
        monthSeconds += seconds;
      }

      const dayIndex = Math.floor((date - weekStart) / 86400000);
      if (dayIndex >= 0 && dayIndex < dailyTotals.length) {
        dailyTotals[dayIndex].seconds += seconds;
      }
    });

    const sortedSubjects = [...subjectTotals.entries()].sort((a, b) => b[1] - a[1]);
    const subjectData = sortedSubjects.map(([subject, seconds]) => ({
      subject,
      percentage: totalSeconds > 0 ? (seconds / totalSeconds) * 100 : 0,
    }));
    const studiedDays = dailyTotals.filter((day) => day.seconds > 0).length || 1;
    const trendData = dailyTotals.map((day) => ({
      label: day.date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
      hours: Number((day.seconds / 3600).toFixed(2)),
    }));

    return {
      averageDailyTime: formatDuration(dailyTotals.reduce((sum, day) => sum + day.seconds, 0) / studiedDays),
      longestSession: formatDuration(longestSeconds),
      monthHours: `${(monthSeconds / 3600).toFixed(1)} hrs`,
      mostStudiedSubject: sortedSubjects[0]?.[0] || "No data",
      mostStudiedPercent: subjectData[0]?.percentage || 0,
      monthlyTotals: monthlyTotals.map((seconds) => Number((seconds / 3600).toFixed(2))),
      subjectData,
      trendData,
    };
  }, [sessions]);

  const maxMonthHours = Math.max(...analytics.monthlyTotals, 1);

  if (!loading && sessions.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-md rounded-3xl border-2 border-dashed border-white/10 p-12 text-center">
          <span className="material-symbols-outlined mb-6 text-6xl text-[#c3c6d7]">query_stats</span>
          <h1 className="mb-2 text-2xl font-semibold text-[#dde2f8]">No Analytics Data</h1>
          <p className="text-[#c3c6d7]">
            Complete a study session to see your progress and subject insights.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
      <AnalyticsCards
        mostStudiedSubject={loading ? "Loading..." : analytics.mostStudiedSubject}
        mostStudiedPercent={analytics.mostStudiedPercent}
        averageDailyTime={loading ? "Loading..." : analytics.averageDailyTime}
        totalHours={loading ? "Loading..." : analytics.monthHours}
        longestSession={loading ? "Loading..." : analytics.longestSession}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <StudyTrendChart data={loading ? [] : analytics.trendData} period={period} onPeriodChange={setPeriod} />
        <SubjectPieChart data={loading ? [] : analytics.subjectData} />
      </div>

      <section className="glass-card rounded-xl p-6">
        <div className="mb-12 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[#dde2f8]">Monthly Comparison</h2>
          <span className="flex items-center gap-1 text-sm font-medium text-[#b4c5ff]">
            Current year <span className="material-symbols-outlined text-sm">calendar_month</span>
          </span>
        </div>

        <div className="flex h-48 items-end gap-2 px-2 sm:gap-3 sm:px-4">
          {analytics.monthlyTotals.map((hours, index) => {
            const heightClass = hours === 0
              ? "h-1"
              : hours / maxMonthHours > 0.75
                ? "h-full"
                : hours / maxMonthHours > 0.5
                  ? "h-3/4"
                  : hours / maxMonthHours > 0.25
                    ? "h-1/2"
                    : "h-1/4";
            return (
              <div
                key={`${index}-${hours}`}
                title={`${hours} hours`}
                className={`w-full rounded-t-lg transition-colors hover:bg-[#b4c5ff] ${
                  index === new Date().getMonth() ? "bg-[#2563eb]" : "bg-[#2f3445]"
                } ${heightClass}`}
              />
            );
          })}
        </div>
        <div className="mt-4 flex justify-between px-2 text-[9px] font-semibold text-[#c3c6d7] sm:px-4 sm:text-xs">
          {"JAN FEB MAR APR MAY JUN JUL AUG SEP OCT NOV DEC".split(" ").map((month) => (
            <span key={month}>{month}</span>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Analytics;
