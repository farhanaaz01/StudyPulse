export const toDate = (value) => {
  if (!value || value === "-") return null;

  const normalized = String(value).includes("T")
    ? String(value)
    : `${value}T00:00:00`;

  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const isCompletedSession = (session) =>
  Number(session?.durationSeconds ?? session?.duration ?? 0) > 0;

export const normalizeSession = (session) => {
  const startTime = session.startTime ?? session.startedAt ?? null;
  const endTime = session.endTime ?? session.endedAt ?? null;
  const date = session.date ?? session.createdAt ?? startTime ?? endTime ?? null;
  const subjectName =
    session.subjectName ??
    (typeof session.subject === "string"
      ? session.subject
      : session.subject?.name) ??
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

export const getSortTime = (session) =>
  toDate(session.endTime)?.getTime() ??
  toDate(session.startTime)?.getTime() ??
  toDate(session.date)?.getTime() ??
  0;

export const parseHistorySessions = (data) => {
  if (!Array.isArray(data)) return [];

  return data
    .map(normalizeSession)
    .filter(isCompletedSession)
    .sort((a, b) => getSortTime(b) - getSortTime(a));
};

export const formatSessionDate = (value) => {
  const date = toDate(value);
  if (!date) return "-";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatSessionClock = (value) => {
  const date = toDate(value);
  if (!date) return "-";

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};
