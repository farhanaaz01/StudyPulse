export function formatGoalTime(seconds = 0) {
  const safeSeconds = Math.max(0, Math.round(Number(seconds) || 0));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);

  if (hours === 0) {
    return `${minutes} min`;
  }

  if (minutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}m`;
}

export function goalTargetToSeconds(goal) {
  if (!goal?.targetValue) {
    return 0;
  }

  if (goal.type === "STREAK") {
    return 0;
  }

  const unit = goal.targetUnit || "HOURS";

  if (unit === "MINUTES") {
    return goal.targetValue * 60;
  }

  return goal.targetValue * 3600;
}

export function getGoalCurrentSeconds(goal) {
  if (!goal || goal.type === "STREAK") {
    return 0;
  }

  const targetSeconds = goalTargetToSeconds(goal);

  if (goal.currentValueSeconds != null) {
    return Math.max(0, Math.round(Number(goal.currentValueSeconds)));
  }

  const raw = Number(goal.currentValue ?? 0);
  if (!raw) {
    return deriveSecondsFromPercentage(goal, targetSeconds);
  }

  // Legacy responses stored progress as fractional hours (e.g. 0.19 = 11 min)
  if (raw > 0 && raw < 24 && !Number.isInteger(raw)) {
    return Math.round(raw * 3600);
  }

  if (raw > 0 && raw < 24 && targetSeconds >= 3600 && raw <= (goal.targetValue ?? 0) * 2) {
    return Math.round(raw * 3600);
  }

  const asSeconds = Math.round(raw);

  if (asSeconds === 0 && goal.percentage > 0) {
    return deriveSecondsFromPercentage(goal, targetSeconds);
  }

  return asSeconds;
}

function deriveSecondsFromPercentage(goal, targetSeconds) {
  if (!goal?.percentage || !targetSeconds) {
    return 0;
  }

  return Math.round((goal.percentage / 100) * targetSeconds);
}

export function formatGoalProgress(goal) {
  if (!goal?.targetValue) {
    return "No target set";
  }

  if (goal.type === "STREAK") {
    const current = Math.round(goal.currentValue ?? 0);
    return `${current} / ${goal.targetValue} days`;
  }

  const currentSeconds = getGoalCurrentSeconds(goal);
  const targetSeconds = goalTargetToSeconds(goal);

  return `${formatGoalTime(currentSeconds)} / ${formatGoalTime(targetSeconds)}`;
}

export function getGoalByType(goals, type) {
  return goals.find((goal) => goal.type === type);
}

export function getWeeklyGoalTargetSeconds(goals) {
  const weeklyGoal = getGoalByType(goals, "WEEKLY");
  return weeklyGoal ? goalTargetToSeconds(weeklyGoal) : null;
}

export function getGoalSummaryLabel(goal) {
  if (!goal) {
    return "No goal set";
  }

  if (goal.type === "SUBJECT" && goal.subjectName) {
    return `${goal.subjectName} progress`;
  }

  if (goal.type === "STREAK") {
    return goal.percentage >= 100 ? "Goal reached" : "Keep going";
  }

  return `${goal.percentage}% complete`;
}
