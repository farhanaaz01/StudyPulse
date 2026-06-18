function Goal({
  goalInput,
  setGoalInput,
  handleSaveGoal,
  goalMinutes,
  currentTodayTotal,
  goalCompleted,
  goalRemaining,
  formatTime,
  isLoading,
}) {
  if (isLoading) {
    return (
      <div className="panel goal-panel">
        <div className="skeleton skeleton-text medium" />
        <div className="goal-row">
          <div className="skeleton skeleton-input" />
          <div className="skeleton skeleton-save" />
        </div>
        <div className="skeleton skeleton-text short center" />
        <div className="skeleton skeleton-progress" />
        <div className="skeleton skeleton-text short center" />
      </div>
    );
  }

  return (
    <div className="panel goal-panel">
      <p className="panel-title">Daily Goal</p>

      <div className="goal-row">
        <input
          className="goal-input"
          type="number"
          min="1"
          value={goalInput}
          onChange={(e) => setGoalInput(e.target.value)}
          placeholder="Enter goal in minutes"
        />

        <button className="btn primary small" onClick={handleSaveGoal}>
          Save
        </button>
      </div>

      <p className="goal-text">Goal: {goalMinutes} minutes</p>

      <div className="progress-wrap">
        <div
          className="progress-bar"
          style={{
            width: `${Math.min(
              (currentTodayTotal / (goalMinutes * 60)) * 100,
              100
            )}%`,
          }}
        ></div>
      </div>

      {goalCompleted ? (
        <p className="goal-success">Goal completed ✅</p>
      ) : (
        <p className="goal-warning">Remaining: {formatTime(goalRemaining)}</p>
      )}
    </div>
  );
}

export default Goal;