import { useCallback, useEffect, useMemo, useState } from "react";
import { getHistoryApi } from "../api/sessionApi";
import HistoryList from "../components/History";
import { getApiErrorMessage } from "../utils/apiError";
import { formatDuration } from "../utils/formatTime";
import {
  formatSessionClock,
  formatSessionDate,
  parseHistorySessions,
} from "../utils/sessionUtils";

function History() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getHistoryApi();
      setSessions(parseHistorySessions(response.data));
    } catch (historyError) {
      console.error(historyError);
      setError(getApiErrorMessage(historyError, "Unable to load study history."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const subjectOptions = useMemo(() => {
    const names = [...new Set(sessions.map((session) => session.subjectName))];
    return names.sort((a, b) => a.localeCompare(b));
  }, [sessions]);

  const filteredSessions = useMemo(() => {
    if (subjectFilter === "all") return sessions;

    return sessions.filter((session) => session.subjectName === subjectFilter);
  }, [sessions, subjectFilter]);

  const totalSeconds = useMemo(
    () =>
      filteredSessions.reduce(
        (total, session) => total + session.durationSeconds,
        0
      ),
    [filteredSessions]
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#dde2f8]">Study History</h1>
          <p className="mt-1 text-sm text-[#c3c6d7]">
            Your completed sessions, newest first
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm text-[#c3c6d7]">
            Subject
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              disabled={loading || sessions.length === 0}
              className="ml-2 rounded-lg border border-white/10 bg-[#151b2b] px-3 py-2 text-sm text-[#dde2f8] focus:border-[#b4c5ff]/50 focus:outline-none disabled:opacity-50"
            >
              <option value="all">All subjects</option>
              {subjectOptions.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={fetchHistory}
            disabled={loading}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-[#dde2f8] transition hover:bg-white/5 disabled:opacity-50"
          >
            Refresh
          </button>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <article className="glass-card rounded-xl p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="rounded-lg bg-[#b4c5ff]/10 p-2 text-[#b4c5ff]">
              <span className="material-symbols-outlined">history</span>
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#c3c6d7]">
              {subjectFilter === "all" ? "All time" : "Filtered"}
            </span>
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#c3c6d7]">
            Total Sessions
          </p>
          <p className="mt-1 text-2xl font-semibold text-[#dde2f8]">
            {loading ? "..." : filteredSessions.length}
          </p>
        </article>

        <article className="glass-card rounded-xl p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="rounded-lg bg-[#0566d9]/20 p-2 text-[#adc6ff]">
              <span className="material-symbols-outlined">timer</span>
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#c3c6d7]">
              Completed
            </span>
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#c3c6d7]">
            Total Study Time
          </p>
          <p className="mt-1 text-2xl font-semibold text-[#dde2f8]">
            {loading ? "..." : formatDuration(totalSeconds)}
          </p>
        </article>

        <article className="glass-card rounded-xl p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="rounded-lg bg-[#585be6]/20 p-2 text-[#c0c1ff]">
              <span className="material-symbols-outlined">calendar_today</span>
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#c3c6d7]">
              Latest
            </span>
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#c3c6d7]">
            Last Session
          </p>
          <p className="mt-1 text-2xl font-semibold text-[#dde2f8]">
            {loading ? "..." : formatSessionDate(filteredSessions[0]?.date)}
          </p>
        </article>
      </section>

      {loading ? (
        <section className="glass-card rounded-2xl p-6">
          <div className="mb-6 h-6 w-48 rounded-full shimmer" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="h-16 rounded-xl shimmer" />
            ))}
          </div>
        </section>
      ) : error ? (
        <section className="glass-card rounded-2xl p-12 text-center">
          <span className="material-symbols-outlined mb-4 text-5xl text-[#ffb4ab]">
            error
          </span>
          <h2 className="mb-2 text-2xl font-semibold text-[#dde2f8]">
            History unavailable
          </h2>
          <p className="mb-6 text-sm text-[#c3c6d7]">{error}</p>
          <button
            type="button"
            onClick={fetchHistory}
            className="rounded-lg bg-[#b4c5ff] px-5 py-2 text-sm font-semibold text-[#00174b]"
          >
            Try again
          </button>
        </section>
      ) : (
        <HistoryList
          sessions={filteredSessions}
          formatDuration={formatDuration}
          formatDate={formatSessionDate}
          formatTime={formatSessionClock}
        />
      )}
    </div>
  );
}

export default History;
