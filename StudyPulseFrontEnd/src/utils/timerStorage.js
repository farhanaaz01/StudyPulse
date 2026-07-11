export const TIMER_KEYS = {
  session: "sp_active_session_id",
  start: "sp_active_session_start",
  subject: "sp_active_subject",
  pausedMs: "sp_active_paused_ms",
  pausedAt: "sp_active_paused_at",
};

export function getActiveSessionId() {
  const value = localStorage.getItem(TIMER_KEYS.session);
  return value ? Number(value) : null;
}

export function hasActiveSession() {
  return Boolean(localStorage.getItem(TIMER_KEYS.session));
}

export function clearTimerStorage() {
  Object.values(TIMER_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
}

export function calcElapsedSeconds(isPaused = false) {
  const start = Number(localStorage.getItem(TIMER_KEYS.start));
  if (!start) return 0;

  const pausedMs = Number(localStorage.getItem(TIMER_KEYS.pausedMs) || 0);
  const pausedAt = localStorage.getItem(TIMER_KEYS.pausedAt);
  let currentPauseMs = 0;

  if (isPaused && pausedAt) {
    currentPauseMs = Date.now() - Number(pausedAt);
  }

  return Math.max(
    0,
    Math.floor((Date.now() - start - pausedMs - currentPauseMs) / 1000)
  );
}

export function getInitialTimerStatus() {
  if (!hasActiveSession()) return "stopped";
  return localStorage.getItem(TIMER_KEYS.pausedAt) ? "paused" : "running";
}
