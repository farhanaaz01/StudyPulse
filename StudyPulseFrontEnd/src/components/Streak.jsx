function Streak({ streak, isLoading, hasAnyStudyData }) {
  if (isLoading) {
    return (
      <div className="panel streak-panel">
        <div className="skeleton skeleton-text medium" />
        <div className="skeleton skeleton-badge" />
        <div className="skeleton skeleton-text short center" />
      </div>
    );
  }

  return (
    <div className="panel streak-panel">
      <p className="panel-title">Consistency Streak</p>

      {!hasAnyStudyData ? (
        <div className="empty-state compact">
          <p className="empty-title">No streak yet</p>
          <p className="empty-text">
            Complete your first session to start a streak.
          </p>
        </div>
      ) : (
        <>
          <div className="streak-badge">
            🔥 {streak} day{streak !== 1 ? "s" : ""}
          </div>

          <p className="panel-note">
            Today should be equal or better than yesterday.
          </p>
        </>
      )}
    </div>
  );
}

export default Streak;