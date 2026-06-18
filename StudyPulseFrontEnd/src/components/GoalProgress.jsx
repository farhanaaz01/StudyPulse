const accentClasses = {
  primary: "accent-[#b4c5ff] text-[#b4c5ff]",
  secondary: "accent-[#adc6ff] text-[#adc6ff]",
  tertiary: "accent-[#c0c1ff] text-[#c0c1ff]",
};

function GoalProgress({
  value = 0,
  max = 100,
  progressLabel,
  statusLabel,
  accent = "primary",
}) {
  const safeMax = Math.max(Number(max) || 0, 1);
  const safeValue = Math.min(Math.max(Number(value) || 0, 0), safeMax);

  return (
    <div className="w-full">
      <div className="mb-2 flex justify-between gap-4 text-xs font-semibold">
        <span className="text-[#c3c6d7]">{progressLabel}</span>
        <span className={accentClasses[accent] || accentClasses.primary}>{statusLabel}</span>
      </div>
      <progress
        className={`block h-2 w-full overflow-hidden rounded-full bg-[#2f3445] ${
          accentClasses[accent]?.split(" ")[0] || "accent-[#b4c5ff]"
        }`}
        value={safeValue}
        max={safeMax}
        aria-label={progressLabel}
      />
    </div>
  );
}

export default GoalProgress;
