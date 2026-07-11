import { toDate } from "./sessionUtils";

export function formatShortDuration(seconds = 0) {
  const safeSeconds = Math.max(0, Number(seconds) || 0);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

const startOfDay = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const endOfDay = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);

const getSessionDate = (session) =>
  toDate(session.date ?? session.endTime ?? session.startTime);

const isWithinRange = (date, rangeStart, rangeEnd) =>
  date && date >= rangeStart && date <= rangeEnd;

function formatWeekRange(startDate, endDate) {
  const startMonth = startDate.toLocaleDateString("en-US", { month: "short" });
  const endMonth = endDate.toLocaleDateString("en-US", { month: "short" });

  if (startMonth === endMonth) {
    return `${startMonth} ${startDate.getDate()}–${endDate.getDate()}`;
  }

  return `${startMonth} ${startDate.getDate()} – ${endMonth} ${endDate.getDate()}`;
}

function buildWeeklyTrendData(dailyTotals) {
  const weeks = [];

  for (let index = 0; index < dailyTotals.length; index += 7) {
    const chunk = dailyTotals.slice(index, index + 7);
    if (chunk.length === 0) continue;

    const totalSeconds = chunk.reduce((sum, day) => sum + day.seconds, 0);
    const startDate = chunk[0].date;
    const endDate = chunk[chunk.length - 1].date;
    const weekNumber = weeks.length + 1;

    weeks.push({
      label: `Week ${weekNumber}`,
      shortLabel: `W${weekNumber}`,
      fullLabel: formatWeekRange(startDate, endDate),
      hours: Number((totalSeconds / 3600).toFixed(1)),
    });
  }

  return weeks;
}

function buildDailyTrendData(dailyTotals) {
  return dailyTotals.map((day) => ({
    label: day.date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
    shortLabel: day.date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
    fullLabel: day.date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    }),
    hours: Number((day.seconds / 3600).toFixed(2)),
  }));
}

export function computeAnalytics(sessions, period = "week") {
  const now = new Date();
  const today = startOfDay(now);
  const rangeDays = period === "month" ? 30 : 7;

  const rangeStart = new Date(today);
  rangeStart.setDate(today.getDate() - (rangeDays - 1));
  const rangeEnd = endOfDay(today);

  const rangeSessions = sessions.filter((session) => {
    const date = getSessionDate(session);
    return isWithinRange(date, rangeStart, rangeEnd);
  });

  const dailyTotals = Array.from({ length: rangeDays }, (_, index) => {
    const date = new Date(rangeStart);
    date.setDate(rangeStart.getDate() + index);
    return { date, seconds: 0 };
  });

  const monthlyTotals = Array.from({ length: 12 }, () => 0);
  const subjectTotals = new Map();

  let monthSeconds = 0;
  let longestSeconds = 0;
  let rangeTotalSeconds = 0;

  sessions.forEach((session) => {
    const seconds = Number(session.durationSeconds ?? 0);
    const date = getSessionDate(session);
    if (!date) return;

    const subject = session.subjectName ?? "General";

    if (date.getFullYear() === now.getFullYear()) {
      monthlyTotals[date.getMonth()] += seconds;
    }

    if (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth()
    ) {
      monthSeconds += seconds;
    }

    if (isWithinRange(date, rangeStart, rangeEnd)) {
      rangeTotalSeconds += seconds;
      longestSeconds = Math.max(longestSeconds, seconds);
      subjectTotals.set(subject, (subjectTotals.get(subject) || 0) + seconds);

      const dayIndex = Math.floor(
        (startOfDay(date) - rangeStart) / 86400000
      );

      if (dayIndex >= 0 && dayIndex < dailyTotals.length) {
        dailyTotals[dayIndex].seconds += seconds;
      }
    }
  });

  const sortedSubjects = [...subjectTotals.entries()].sort(
    (a, b) => b[1] - a[1]
  );

  const subjectData = sortedSubjects.map(([subject, seconds]) => ({
    subject,
    percentage:
      rangeTotalSeconds > 0 ? (seconds / rangeTotalSeconds) * 100 : 0,
  }));

  const studiedDays =
    dailyTotals.filter((day) => day.seconds > 0).length || 1;

  const trendData =
    period === "month"
      ? buildWeeklyTrendData(dailyTotals)
      : buildDailyTrendData(dailyTotals);

  return {
    averageDailyTime: formatShortDuration(
      dailyTotals.reduce((sum, day) => sum + day.seconds, 0) / studiedDays
    ),
    longestSession: formatShortDuration(longestSeconds),
    periodTotalHours: `${(rangeTotalSeconds / 3600).toFixed(1)} hrs`,
    monthHours: `${(monthSeconds / 3600).toFixed(1)} hrs`,
    mostStudiedSubject: sortedSubjects[0]?.[0] || "No data",
    mostStudiedPercent: subjectData[0]?.percentage || 0,
    monthlyTotals: monthlyTotals.map((seconds) =>
      Number((seconds / 3600).toFixed(2))
    ),
    subjectData,
    trendData,
    trendType: period === "month" ? "weekly-bars" : "daily-line",
    rangeSessionCount: rangeSessions.length,
    periodLabel: period === "month" ? "Last 30 days" : "Last 7 days",
  };
}
