import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { stopSessionApi } from "../api/sessionApi";
import {
  TIMER_KEYS,
  calcElapsedSeconds,
  clearTimerStorage,
  getActiveSessionId,
  getInitialTimerStatus,
  hasActiveSession,
} from "../utils/timerStorage";
import { dispatchSessionStopped } from "../utils/timerEvents";

function formatCompactTime(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function GlobalTimerBar() {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(hasActiveSession());
  const [status, setStatus] = useState(getInitialTimerStatus());
  const [seconds, setSeconds] = useState(
    hasActiveSession() ? calcElapsedSeconds(getInitialTimerStatus() === "paused") : 0
  );
  const [isBusy, setIsBusy] = useState(false);

  const subjectName = localStorage.getItem(TIMER_KEYS.subject) || "Study session";
  const isActive = status === "running" || status === "paused";

  const syncElapsed = useCallback(() => {
    if (!hasActiveSession()) {
      setVisible(false);
      setSeconds(0);
      setStatus("stopped");
      return;
    }

    setVisible(true);
    setSeconds(calcElapsedSeconds(status === "paused"));
  }, [status]);

  useEffect(() => {
    syncElapsed();
  }, [pathname, syncElapsed]);

  useEffect(() => {
    if (!visible || status !== "running") return undefined;

    const id = setInterval(syncElapsed, 1000);
    return () => clearInterval(id);
  }, [visible, status, syncElapsed]);

  const handlePause = () => {
    if (status === "running") {
      localStorage.setItem(TIMER_KEYS.pausedAt, String(Date.now()));
      setSeconds(calcElapsedSeconds(true));
      setStatus("paused");
      return;
    }

    if (status === "paused") {
      const pausedAt = Number(localStorage.getItem(TIMER_KEYS.pausedAt));
      const pausedMs =
        Number(localStorage.getItem(TIMER_KEYS.pausedMs) || 0) +
        (Date.now() - pausedAt);

      localStorage.setItem(TIMER_KEYS.pausedMs, String(pausedMs));
      localStorage.removeItem(TIMER_KEYS.pausedAt);
      setStatus("running");
    }
  };

  const handleStop = async () => {
    const activeId = getActiveSessionId();
    if (!activeId) return;

    setIsBusy(true);

    try {
      const elapsed = calcElapsedSeconds(status === "paused");
      await stopSessionApi(activeId, elapsed);
      dispatchSessionStopped();
    } catch (err) {
      console.error(err);
      alert("Failed to stop session");
    } finally {
      clearTimerStorage();
      setStatus("stopped");
      setVisible(false);
      setSeconds(0);
      setIsBusy(false);
    }
  };

  if (!visible || pathname === "/dashboard" || !isActive) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-0 right-0 z-40 mx-4 md:bottom-6 md:left-[276px] md:right-6">
      <div className="glass-card flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#b4c5ff]/20 px-4 py-3 shadow-lg">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#b4c5ff]">
            {status === "paused" ? "Paused" : "Studying"}
          </p>
          <p className="truncate text-sm font-medium text-[#dde2f8]">{subjectName}</p>
        </div>

        <p className="font-mono text-xl font-semibold text-[#eeefff]">
          {formatCompactTime(seconds)}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePause}
            disabled={isBusy}
            className="rounded-lg border border-white/10 px-3 py-2 text-sm text-[#dde2f8] transition hover:bg-white/5 disabled:opacity-50"
          >
            {status === "paused" ? "Resume" : "Pause"}
          </button>
          <button
            type="button"
            onClick={handleStop}
            disabled={isBusy}
            className="rounded-lg bg-[#ffb4ab]/15 px-3 py-2 text-sm font-medium text-[#ffb4ab] transition hover:bg-[#ffb4ab]/25 disabled:opacity-50"
          >
            Stop
          </button>
          <Link
            to="/dashboard"
            className="rounded-lg bg-[#b4c5ff] px-3 py-2 text-sm font-semibold text-[#00174b] transition hover:bg-[#2563eb] hover:text-white"
          >
            Open
          </Link>
        </div>
      </div>
    </div>
  );
}

export default GlobalTimerBar;
