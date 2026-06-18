function Badges({
  totalStudySeconds,
  totalSessions,
  streak,
  isLoading,
  hasAnyStudyData,
}) {
  if (isLoading) {
    return (
      <div className="panel badge-panel">
        <div className="skeleton skeleton-text medium" />
        <div className="badge-grid">
          {[1, 2, 3, 4].map((item) => (
            <div className="skeleton skeleton-badge-card" key={item} />
          ))}
        </div>
      </div>
    );
  }

  const totalHours = totalStudySeconds / 3600;

  const level =
    totalHours >= 10 ? 5 :
    totalHours >= 5 ? 4 :
    totalHours >= 2 ? 3 :
    totalHours >= 1 ? 2 : 1;

  const badges = [
    {
      title: "First Session",
      unlocked: totalSessions >= 1,
      icon: "🎯",
    },
    {
      title: "1 Hour Complete",
      unlocked: totalStudySeconds >= 3600,
      icon: "⏱️",
    },
    {
      title: "3 Day Streak",
      unlocked: streak >= 3,
      icon: "🔥",
    },
    {
      title: "5 Sessions",
      unlocked: totalSessions >= 5,
      icon: "📚",
    },
    {
      title: "10 Hours Complete",
      unlocked: totalStudySeconds >= 36000,
      icon: "🏆",
    },
  ];

  return (
    <div className="panel badge-panel">
      <div className="badge-head">
        <p className="panel-title">Achievements</p>
        <span className="level-pill">Level {level}</span>
      </div>

      {!hasAnyStudyData ? (
        <div className="empty-state compact">
          <p className="empty-title">No badges yet</p>
          <p className="empty-text">
            Start studying and complete sessions to unlock badges.
          </p>
        </div>
      ) : (
        <>
          <div className="badge-grid">
            {badges.map((badge) => (
              <div
                key={badge.title}
                className={`badge-card ${badge.unlocked ? "unlocked" : ""}`}
              >
                <div className="badge-icon">{badge.icon}</div>
                <p className="badge-title">{badge.title}</p>
                <p className="badge-status">
                  {badge.unlocked ? "Unlocked" : "Locked"}
                </p>
              </div>
            ))}
          </div>

          <p className="panel-note">
            Keep going. More study = more badges unlocked.
          </p>
        </>
      )}
    </div>
  );
}

export default Badges;