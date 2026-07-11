import { useCallback, useEffect, useMemo, useState } from "react";
import { getHistoryApi } from "../api/sessionApi";
import AnalyticsCards from "../components/AnalyticsCards";
import StudyTrendChart from "../components/StudyTrendChart";
import SubjectPieChart from "../components/SubjectPieChart";
import { getApiErrorMessage } from "../utils/apiError";
import { computeAnalytics } from "../utils/analyticsUtils";
import { parseHistorySessions } from "../utils/sessionUtils";

function Analytics() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState("week");

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getHistoryApi();
      setSessions(parseHistorySessions(response.data));
    } catch (err) {
      console.error(err);
      setError(getApiErrorMessage(err, "Unable to load analytics data."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const analytics = useMemo(
    () => computeAnalytics(sessions, period),
    [sessions, period]
  );

  const maxMonthHours = Math.max(...analytics.monthlyTotals, 1);

  if (!loading && !error && sessions.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-md rounded-3xl border-2 border-dashed border-white/10 p-12 text-center">
          <span className="material-symbols-outlined mb-6 text-6xl text-[#c3c6d7]">
            query_stats
          </span>
          <h1 className="mb-2 text-2xl font-semibold text-[#dde2f8]">
            No Analytics Data
          </h1>
          <p className="text-[#c3c6d7]">
            Complete a study session to see your progress and subject insights.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#dde2f8]">Analytics</h1>
          <p className="mt-1 text-sm text-[#c3c6d7]">
            Insights from your completed study sessions
          </p>
        </div>

        <button
          type="button"
          onClick={fetchSessions}
          disabled={loading}
          className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-[#dde2f8] transition hover:bg-white/5 disabled:opacity-50"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="flex flex-col gap-4 rounded-xl border border-[#ffb4ab]/30 bg-[#ffb4ab]/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-sm text-[#ffb4ab]">{error}</p>
          <button
            type="button"
            onClick={fetchSessions}
            className="rounded-lg bg-[#b4c5ff] px-4 py-2 text-sm font-semibold text-[#00174b]"
          >
            Try again
          </button>
        </div>
      )}

      <AnalyticsCards
        mostStudiedSubject={loading ? "..." : analytics.mostStudiedSubject}
        mostStudiedPercent={analytics.mostStudiedPercent}
        averageDailyTime={loading ? "..." : analytics.averageDailyTime}
        totalHours={loading ? "..." : analytics.periodTotalHours}
        longestSession={loading ? "..." : analytics.longestSession}
        periodLabel={analytics.periodLabel}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <StudyTrendChart
          data={loading ? [] : analytics.trendData}
          period={period}
          trendType={analytics.trendType}
          onPeriodChange={setPeriod}
        />
        <SubjectPieChart data={loading ? [] : analytics.subjectData} />
      </div>

      <section className="glass-card rounded-xl p-6">
        <div className="mb-12 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[#dde2f8]">
            Monthly Comparison
          </h2>
          <span className="flex items-center gap-1 text-sm font-medium text-[#b4c5ff]">
            Current year
            <span className="material-symbols-outlined text-sm">
              calendar_month
            </span>
          </span>
        </div>

        <div className="flex h-48 items-end gap-2 px-2 sm:gap-3 sm:px-4">
          {analytics.monthlyTotals.map((hours, index) => {
            const heightClass =
              hours === 0
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
                  index === new Date().getMonth()
                    ? "bg-[#2563eb]"
                    : "bg-[#2f3445]"
                } ${heightClass}`}
              />
            );
          })}
        </div>

        <div className="mt-4 flex justify-between px-2 text-[9px] font-semibold text-[#c3c6d7] sm:px-4 sm:text-xs">
          {"JAN FEB MAR APR MAY JUN JUL AUG SEP OCT NOV DEC"
            .split(" ")
            .map((month) => (
              <span key={month}>{month}</span>
            ))}
        </div>
      </section>
    </div>
  );
}

export default Analytics;
