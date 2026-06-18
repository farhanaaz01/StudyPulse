import { useEffect, useState } from "react";
import {
  startSessionApi,
  stopSessionApi,
} from "../api/sessionApi";

function Timer({ selectedSubject, onStop }) {

  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {

    let intervalId;

    if (isRunning && !isPaused) {
      intervalId = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);

  }, [isRunning, isPaused]);

  const formatTime = (totalSeconds) => {

    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor(
      (totalSeconds % 3600) / 60
    );
    const secs = totalSeconds % 60;

    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleStart = async () => {

    if (!selectedSubject) {
      alert("Select a subject first");
      return;
    }

    try {

      const response =
        await startSessionApi(
          selectedSubject.id
        );

      setSessionId(
        response.data.id
      );

      setIsRunning(true);
      setIsPaused(false);

      console.log(
        "Session Started",
        response.data
      );

    } catch (error) {

      console.error(error);

      alert(
        "Failed to start session"
      );
    }
  };

  const handlePauseResume = () => {

    if (!isRunning && seconds === 0)
      return;

    if (isRunning && !isPaused) {

      setIsPaused(true);

    } else {

      setIsRunning(true);
      setIsPaused(false);

    }
  };

  const handleStop = async () => {

    try {

      if (sessionId) {

        await stopSessionApi(
          sessionId
        );

        console.log(
          "Session Stopped"
        );
      }

    } catch (error) {

      console.error(error);
    }

    if (typeof onStop === "function") {

      onStop({
        subject: selectedSubject?.name,
        duration: seconds,
      });
    }

    setIsRunning(false);
    setIsPaused(false);
    setSeconds(0);
    setSessionId(null);
  };

  const handleReset = () => {

    setSeconds(0);
    setIsRunning(false);
    setIsPaused(false);
    setSessionId(null);
  };

  const getStatus = () => {

    if (isRunning && isPaused)
      return "Paused";

    if (isRunning)
      return "Running";

    return "Stopped";
  };

  return (
    <div style={styles.wrapper}>
      <h3 style={styles.title}>
        Study Timer
      </h3>

      <div style={styles.subject}>
        Subject:
        <span style={styles.subjectName}>
          {" "}
          {selectedSubject?.name ||
            "Not selected"}
        </span>
      </div>

      <div style={styles.time}>
        {formatTime(seconds)}
      </div>

      <div style={styles.status}>
        Status:
        <span style={styles.statusText}>
          {" "}
          {getStatus()}
        </span>
      </div>

      <div style={styles.buttons}>

        <button
          type="button"
          onClick={handleStart}
          style={styles.primaryBtn}
          disabled={isRunning}
        >
          Start
        </button>

        <button
          type="button"
          onClick={handlePauseResume}
          style={styles.secondaryBtn}
          disabled={
            seconds === 0 &&
            !isRunning
          }
        >
          {isRunning && !isPaused
            ? "Pause"
            : "Resume"}
        </button>

        <button
          type="button"
          onClick={handleStop}
          style={styles.secondaryBtn}
          disabled={seconds === 0}
        >
          Stop
        </button>

        <button
          type="button"
          onClick={handleReset}
          style={styles.secondaryBtn}
        >
          Reset
        </button>

      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    background: "#111827",
    border: "1px solid #243244",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "24px",
    textAlign: "center",
  },
  title: {
    margin: "0 0 18px",
    color: "#ffffff",
    fontSize: "20px",
  },
  subject: {
    color: "#cbd5e1",
    marginBottom: "10px",
  },
  subjectName: {
    color: "#ffffff",
    fontWeight: "600",
  },
  time: {
    fontSize: "48px",
    fontWeight: "700",
    color: "#ffffff",
    margin: "14px 0",
    letterSpacing: "1px",
  },
  status: {
    color: "#cbd5e1",
    marginBottom: "18px",
  },
  statusText: {
    color: "#93c5fd",
    fontWeight: "600",
  },
  buttons: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "10px",
  },
  primaryBtn: {
    padding: "10px 16px",
    borderRadius: "10px",
    border: "none",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
  },
  secondaryBtn: {
    padding: "10px 16px",
    borderRadius: "10px",
    border: "1px solid #334155",
    background: "#1f2937",
    color: "#fff",
    cursor: "pointer",
  },
};

export default Timer;