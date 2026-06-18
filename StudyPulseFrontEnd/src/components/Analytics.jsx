function Analytics({
  focusScore,
  todaySessionCount,
  averageSessionSeconds,
  formatTime,
  isLoading,
  hasAnyStudyData,
}) {
  if (isLoading) {
    return (
      <div className="analytics-box">
        <div className="skeleton skeleton-text medium center" />
        <div className="analytics-grid">
          <div className="skeleton skeleton-analytics-card" />
          <div className="skeleton skeleton-analytics-card" />
          <div className="skeleton skeleton-analytics-card" />
        </div>
      </div>
    );
  }

  if (!hasAnyStudyData) {
    return (
      <div className="analytics-box">
        <h3 className="analytics-title">Focus Analytics</h3>
        <div className="empty-state compact">
          <p className="empty-title">No analytics yet</p>
          <p className="empty-text">
            Start your first study session to see focus score, session count,
            and average time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-box">
      <h3 className="analytics-title">Focus Analytics</h3>

      <div className="analytics-grid">
        <div className="analytics-card">
          <p className="analytics-label">Focus Score</p>
          <p className="analytics-value">{focusScore}/100</p>
        </div>

        <div className="analytics-card">
          <p className="analytics-label">Sessions Today</p>
          <p className="analytics-value">{todaySessionCount}</p>
        </div>

        <div className="analytics-card">
          <p className="analytics-label">Average Session</p>
          <p className="analytics-value">{formatTime(averageSessionSeconds)}</p>
        </div>
      </div>
    </div>
  );
}

export default Analytics;