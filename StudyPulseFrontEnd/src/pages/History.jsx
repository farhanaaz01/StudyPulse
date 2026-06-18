import { useCallback, useEffect, useMemo, useState } from "react";
import { getHistoryApi } from "../api/sessionApi";
import HistoryList from "../components/History";

const toDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const normalizeSession = (session) => {
  const startTime = session.startTime ?? session.startedAt ?? null;
  const endTime = session.endTime ?? session.endedAt ?? null;
  const date = session.date ?? session.createdAt ?? startTime ?? endTime ?? null;
  const subjectName =
    session.subjectName ??
    (typeof session.subject === "string" ? session.subject : session.subject?.name) ??
    "Unknown Subject";

  return {
    id: session.id,
    subjectName,
    durationSeconds: Number(session.durationSeconds ?? session.duration ?? 0),
    startTime,
    endTime,
    date,
  };
};

const getSortTime = (session) => {
  return (
    toDate(session.endTime)?.getTime() ??
    toDate(session.startTime)?.getTime() ??
    toDate(session.date)?.getTime() ??
    0
  );
};

function History() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHistory = useCallback(async () => {
    try {
      setError("");
      const response = await getHistoryApi();
      const nextSessions = Array.isArray(response.data)
        ? response.data.map(normalizeSession).sort((a, b) => getSortTime(b) - getSortTime(a))
        : [];

      setSessions(nextSessions);
    } catch (historyError) {
      console.error(historyError);
      setError("Unable to load study history right now.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(fetchHistory, 0);
    return () => clearTimeout(timeoutId);
  }, [fetchHistory]);

  const totalSeconds = useMemo(
    () => sessions.reduce((total, session) => total + session.durationSeconds, 0),
    [sessions]
  );

  const formatDuration = (seconds = 0) => {
    const safeSeconds = Number(seconds) || 0;
    const hours = Math.floor(safeSeconds / 3600);
    const minutes = Math.floor((safeSeconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatDate = (value) => {
    const date = toDate(value);
    if (!date) return "-";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (value) => {
    const date = toDate(value);
    if (!date) return "-";

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <article className="glass-card rounded-xl p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="rounded-lg bg-[#b4c5ff]/10 p-2 text-[#b4c5ff]">
              <span className="material-symbols-outlined">history</span>
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#c3c6d7]">All time</span>
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#c3c6d7]">Total Sessions</p>
          <p className="mt-1 text-2xl font-semibold text-[#dde2f8]">{loading ? "..." : sessions.length}</p>
        </article>

        <article className="glass-card rounded-xl p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="rounded-lg bg-[#0566d9]/20 p-2 text-[#adc6ff]">
              <span className="material-symbols-outlined">timer</span>
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#c3c6d7]">Completed</span>
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#c3c6d7]">Total Study Time</p>
          <p className="mt-1 text-2xl font-semibold text-[#dde2f8]">
            {loading ? "..." : formatDuration(totalSeconds)}
          </p>
        </article>

        <article className="glass-card rounded-xl p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="rounded-lg bg-[#585be6]/20 p-2 text-[#c0c1ff]">
              <span className="material-symbols-outlined">calendar_today</span>
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#c3c6d7]">Latest</span>
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#c3c6d7]">Last Session</p>
          <p className="mt-1 text-2xl font-semibold text-[#dde2f8]">
            {loading ? "..." : formatDate(sessions[0]?.date)}
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
          <span className="material-symbols-outlined mb-4 text-5xl text-[#ffb4ab]">error</span>
          <h2 className="mb-2 text-2xl font-semibold text-[#dde2f8]">History unavailable</h2>
          <p className="text-sm text-[#c3c6d7]">{error}</p>
        </section>
      ) : (
        <HistoryList
          sessions={sessions}
          formatDuration={formatDuration}
          formatDate={formatDate}
          formatTime={formatTime}
        />
      )}
    </div>
  );
}

export default History;
