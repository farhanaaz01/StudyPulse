import GoalProgress from "./GoalProgress";

const accentClasses = {
  primary: {
    badge: "bg-[#b4c5ff]/10 text-[#b4c5ff]",
    percentage: "text-[#b4c5ff]",
  },
  secondary: {
    badge: "bg-[#0566d9]/20 text-[#adc6ff]",
    percentage: "text-[#adc6ff]",
  },
  tertiary: {
    badge: "bg-[#585be6]/20 text-[#c0c1ff]",
    percentage: "text-[#c0c1ff]",
  },
};

function GoalCard({
  period,
  title,
  description,
  value,
  max,
  progressLabel,
  statusLabel,
  accent = "primary",
}) {
  const styles = accentClasses[accent] || accentClasses.primary;
  const percentage = Math.min(Math.round(((Number(value) || 0) / Math.max(Number(max) || 0, 1)) * 100), 100);

  return (
    <article className="glass-card flex h-[220px] flex-col justify-between rounded-2xl p-6">
      <div>
        <div className="mb-4 flex items-start justify-between gap-4">
          <span className={`rounded-md px-2 py-1 text-xs font-semibold uppercase tracking-wider ${styles.badge}`}>
            {period}
          </span>
          <span className={`font-mono text-sm ${styles.percentage}`}>{percentage}%</span>
        </div>
        <h2 className="mb-1 text-2xl font-semibold text-[#dde2f8]">{title}</h2>
        <p className="text-sm text-[#c3c6d7]">{description}</p>
      </div>

      <GoalProgress
        value={value}
        max={max}
        progressLabel={progressLabel}
        statusLabel={statusLabel}
        accent={accent}
      />
    </article>
  );
}

export default GoalCard;
