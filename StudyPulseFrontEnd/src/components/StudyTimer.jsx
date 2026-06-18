import { useEffect, useState } from "react";
import { startSessionApi, stopSessionApi } from "../api/sessionApi";

function StudyTimer({ selectedSubject, onSessionStopped }) {
  const [seconds, setSeconds] = useState(0);
  const [status, setStatus] = useState("stopped");
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    if (status !== "running") return undefined;

    const intervalId = setInterval(() => {
      setSeconds((value) => value + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [status]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const remainingSeconds = totalSeconds % 60;

    return [hours, minutes, remainingSeconds]
      .map((value) => String(value).padStart(2, "0"))
      .join(":");
  };

  const handleStart = async () => {
    if (!selectedSubject) {
      alert("Select a subject first");
      return;
    }

    try {
      const response = await startSessionApi(selectedSubject.id);
      setSessionId(response.data.id);
      setStatus("running");
    } catch (error) {
      console.error(error);
      alert("Failed to start session");
    }
  };

  const handlePause = () => {
    setStatus((current) => (current === "running" ? "paused" : "running"));
  };

  const handleStop = async () => {
    try {
      if (sessionId) await stopSessionApi(sessionId);
      onSessionStopped?.();
    } catch (error) {
      console.error(error);
      alert("Failed to stop session");
    } finally {
      setStatus("stopped");
      setSessionId(null);
      setSeconds(0);
    }
  };

  const handleReset = () => {
    setSeconds(0);
    if (!sessionId) setStatus("stopped");
  };

  return (
    <section className="glass-card relative overflow-hidden rounded-xl p-6">
      <div className="absolute inset-x-0 top-0 bg-[#2f3445]">
        <progress className="progress-bar timer-progress block" value={seconds % 3600} max="3600" />
      </div>

      <div className="space-y-6 py-4 text-center">
        <div>
          <span className="rounded-full bg-[#b4c5ff]/20 px-3 py-1 text-xs font-semibold uppercase text-[#b4c5ff]">
            {status === "running" ? "Current Focused Session" : "Ready to Focus"}
          </span>
          <h2 className="mt-2 text-2xl font-semibold text-[#dde2f8]">
            {selectedSubject?.name || "Select a subject"}
          </h2>
        </div>

        <p className="font-mono text-5xl font-medium tracking-tighter text-[#eeefff] drop-shadow-sm sm:text-7xl lg:text-8xl">
          {formatTime(seconds)}
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <button
            type="button"
            onClick={handleStart}
            disabled={status !== "stopped"}
            className="flex items-center gap-2 rounded-xl bg-[#b4c5ff] px-6 py-3 font-bold text-[#00174b] shadow-lg shadow-blue-500/20 transition hover:bg-[#2563eb] hover:text-white active:scale-95"
          >
            <span className="material-symbols-outlined filled-icon">play_arrow</span>
            Start Session
          </button>
          <button
            type="button"
            onClick={handlePause}
            disabled={status === "stopped"}
            className="flex items-center gap-2 rounded-xl border border-white/5 bg-[#2f3445] px-6 py-3 font-bold text-[#dde2f8] transition hover:bg-[#242a3a] active:scale-95"
          >
            <span className="material-symbols-outlined">
              {status === "paused" ? "play_arrow" : "pause"}
            </span>
            {status === "paused" ? "Resume" : "Pause"}
          </button>
          <button
            type="button"
            onClick={handleStop}
            disabled={status === "stopped"}
            aria-label="Stop session"
            className="rounded-xl bg-[#ffb4ab]/10 px-4 py-3 font-bold text-[#ffb4ab] transition hover:bg-[#ffb4ab]/20 active:scale-95"
          >
            <span className="material-symbols-outlined">stop</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            aria-label="Reset timer"
            className="rounded-xl border border-[#434655] px-4 py-3 text-[#c3c6d7] transition hover:bg-white/5 active:scale-95"
          >
            <span className="material-symbols-outlined">refresh</span>
          </button>
        </div>

        <p className="mx-auto max-w-lg border-t border-white/5 pt-6 text-sm italic text-[#c3c6d7]">
          “The only way to learn a new programming language is by writing programs in it.”
          {" — "}Dennis Ritchie
        </p>
      </div>
    </section>
  );
}

export default StudyTimer;
