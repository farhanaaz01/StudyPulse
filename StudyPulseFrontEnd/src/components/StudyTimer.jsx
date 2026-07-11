import { useCallback, useEffect, useRef, useState } from "react";
import { startSessionApi, stopSessionApi } from "../api/sessionApi";
import { dispatchSessionStopped } from "../utils/timerEvents";
import {
  TIMER_KEYS,
  calcElapsedSeconds,
  clearTimerStorage,
  getActiveSessionId,
  getInitialTimerStatus,
  hasActiveSession,
} from "../utils/timerStorage";

function persistRunningSession(sessionId, subject) {
  const now = Date.now();
  localStorage.setItem(TIMER_KEYS.session, String(sessionId));
  localStorage.setItem(TIMER_KEYS.start, String(now));
  localStorage.setItem(TIMER_KEYS.subject, subject.name);
  localStorage.removeItem(TIMER_KEYS.pausedMs);
  localStorage.removeItem(TIMER_KEYS.pausedAt);
}

function StudyTimer({ selectedSubject, onSessionStopped }) {
  const initialStatus = getInitialTimerStatus();
  const storedSessionId = getActiveSessionId();

  const [seconds, setSeconds] = useState(
    storedSessionId ? calcElapsedSeconds(initialStatus === "paused") : 0
  );
  const [status, setStatus] = useState(initialStatus);
  const [sessionId, setSessionId] = useState(storedSessionId);
  const [isBusy, setIsBusy] = useState(false);
  const prevSubjectIdRef = useRef(null);
  const isSwitchingRef = useRef(false);

  const storedSubjectName = localStorage.getItem(TIMER_KEYS.subject);
  const activeSubject =
    selectedSubject || (storedSubjectName ? { name: storedSubjectName } : null);

  const syncElapsed = useCallback(() => {
    setSeconds(calcElapsedSeconds(status === "paused"));
  }, [status]);

  useEffect(() => {
    if (status !== "running") return undefined;

    syncElapsed();
    const id = setInterval(syncElapsed, 1000);
    return () => clearInterval(id);
  }, [status, syncElapsed]);

  useEffect(() => {
    const nextSubjectId = selectedSubject?.id ?? null;
    if (!nextSubjectId) return;

    const prevSubjectId = prevSubjectIdRef.current;

    if (prevSubjectId === null) {
      prevSubjectIdRef.current = nextSubjectId;
      return;
    }

    if (prevSubjectId === nextSubjectId) return;

    prevSubjectIdRef.current = nextSubjectId;

    const activeId = sessionId || getActiveSessionId();
    const isActiveSession =
      activeId && (status === "running" || status === "paused");

    if (!isActiveSession || isSwitchingRef.current) return;

    const subjectToStart = selectedSubject;

    const switchSession = async () => {
      isSwitchingRef.current = true;
      setIsBusy(true);

      try {
        const elapsed = calcElapsedSeconds(status === "paused");
        await stopSessionApi(activeId, elapsed);
        onSessionStopped?.();

        const response = await startSessionApi(subjectToStart.id);
        const newSessionId = response.data.id;

        persistRunningSession(newSessionId, subjectToStart);

        setSessionId(newSessionId);
        setStatus("running");
        setSeconds(0);
      } catch (err) {
        console.error(err);
        alert("Failed to switch subject. Your previous session was saved.");
        clearTimerStorage();
        setStatus("stopped");
        setSessionId(null);
        setSeconds(0);
      } finally {
        isSwitchingRef.current = false;
        setIsBusy(false);
      }
    };

    switchSession();
  }, [selectedSubject, sessionId, status, onSessionStopped]);

  const formatTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
  };

  const getStatusLabel = () => {
    if (status === "running") return "Current Focused Session";
    if (status === "paused") return "Session Paused";
    return "Ready to Focus";
  };

  const handleStart = async () => {
    if (!selectedSubject) {
      alert("Select a subject first");
      return;
    }

    if (hasActiveSession()) {
      alert("A session is already running. Stop it before starting a new one.");
      return;
    }

    setIsBusy(true);

    try {
      const response = await startSessionApi(selectedSubject.id);
      const id = response.data.id;

      persistRunningSession(id, selectedSubject);
      prevSubjectIdRef.current = selectedSubject.id;

      setSessionId(id);
      setStatus("running");
      setSeconds(0);
    } catch (err) {
      console.error(err);
      alert("Failed to start session");
    } finally {
      setIsBusy(false);
    }
  };

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

  const finalizeStop = async (activeId) => {
    const elapsed = calcElapsedSeconds(status === "paused");

    if (activeId) {
      await stopSessionApi(activeId, elapsed);
    }

    dispatchSessionStopped();
    onSessionStopped?.();
  };

  const handleStop = async () => {
    const activeId = sessionId || getActiveSessionId();
    setIsBusy(true);

    try {
      await finalizeStop(activeId);
    } catch (err) {
      console.error("Stop error:", err);
      alert("Failed to stop session");
    } finally {
      clearTimerStorage();
      setStatus("stopped");
      setSessionId(null);
      setSeconds(0);
      setIsBusy(false);
    }
  };

  const handleReset = async () => {
    const activeId = sessionId || getActiveSessionId();

    if (!activeId) {
      setSeconds(0);
      setStatus("stopped");
      return;
    }

    const shouldStop = window.confirm(
      "Stop this session and save your elapsed time?"
    );

    if (!shouldStop) return;

    await handleStop();
  };

  const isActive = status === "running" || status === "paused";

  return (
    <section className="glass-card relative overflow-hidden rounded-xl p-6">
      <div className="absolute inset-x-0 top-0 bg-[#2f3445]">
        <progress
          className="progress-bar timer-progress block"
          value={seconds % 3600}
          max="3600"
        />
      </div>

      <div className="space-y-6 py-4 text-center">
        <div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${
              status === "paused"
                ? "bg-[#ffb4ab]/20 text-[#ffb4ab]"
                : status === "running"
                  ? "bg-[#b4c5ff]/20 text-[#b4c5ff]"
                  : "bg-white/5 text-[#c3c6d7]"
            }`}
          >
            {getStatusLabel()}
          </span>
          <h2 className="mt-2 text-2xl font-semibold text-[#dde2f8]">
            {activeSubject?.name || "Select a subject"}
          </h2>
        </div>

        <p className="font-mono text-5xl font-medium tracking-tighter text-[#eeefff] drop-shadow-sm sm:text-7xl lg:text-8xl">
          {formatTime(seconds)}
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <button
            type="button"
            onClick={handleStart}
            disabled={isActive || isBusy}
            className="flex items-center gap-2 rounded-xl bg-[#b4c5ff] px-6 py-3 font-bold text-[#00174b] shadow-lg shadow-blue-500/20 transition hover:bg-[#2563eb] hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="material-symbols-outlined filled-icon">
              play_arrow
            </span>
            Start Session
          </button>

          <button
            type="button"
            onClick={handlePause}
            disabled={!isActive || isBusy}
            className="flex items-center gap-2 rounded-xl border border-white/5 bg-[#2f3445] px-6 py-3 font-bold text-[#dde2f8] transition hover:bg-[#242a3a] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="material-symbols-outlined">
              {status === "paused" ? "play_arrow" : "pause"}
            </span>
            {status === "paused" ? "Resume" : "Pause"}
          </button>

          <button
            type="button"
            onClick={handleStop}
            disabled={!isActive || isBusy}
            aria-label="Stop session"
            className="rounded-xl bg-[#ffb4ab]/10 px-4 py-3 font-bold text-[#ffb4ab] transition hover:bg-[#ffb4ab]/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="material-symbols-outlined">stop</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={isBusy}
            aria-label="Reset timer"
            title={
              isActive
                ? "Stops the session and saves elapsed time"
                : "Reset display"
            }
            className="rounded-xl border border-[#434655] px-4 py-3 text-[#c3c6d7] transition hover:bg-white/5 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="material-symbols-outlined">refresh</span>
          </button>
        </div>

        {isActive && (
          <p className="text-xs text-[#8d90a0]">
            Paused time is excluded from your logged study duration.
          </p>
        )}

        <p className="mx-auto max-w-lg border-t border-white/5 pt-6 text-sm italic text-[#c3c6d7]">
          "The only way to learn a new programming language is by writing
          programs in it."
          {" — "}Dennis Ritchie
        </p>
      </div>
    </section>
  );
}

export default StudyTimer;
