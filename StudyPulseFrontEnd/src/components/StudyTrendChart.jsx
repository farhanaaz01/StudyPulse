function StudyTrendChart({ data = [], period = "week", onPeriodChange }) {
  const width = 800;
  const height = 240;
  const padding = 20;
  const maxValue = Math.max(...data.map((item) => item.hours), 1);
  const step = data.length > 1 ? (width - padding * 2) / (data.length - 1) : 0;
  const points = data.map((item, index) => ({
    ...item,
    x: padding + index * step,
    y: height - padding - (item.hours / maxValue) * (height - padding * 2),
  }));
  const linePoints = points.map((point) => `${point.x},${point.y}`).join(" ");
  const areaPoints = points.length
    ? `${padding},${height - padding} ${linePoints} ${width - padding},${height - padding}`
    : "";

  return (
    <section className="glass-card overflow-hidden rounded-xl p-6 lg:col-span-8">
      <div className="mb-12 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-[#dde2f8]">Weekly Study Trend</h2>
          <p className="text-sm text-[#c3c6d7]">Hours focused per day over the current week</p>
        </div>
        <div className="flex gap-2">
          {["week", "month"].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onPeriodChange?.(option)}
              className={`rounded-lg px-3 py-1 text-sm font-medium capitalize transition ${
                period === option
                  ? "bg-[#2f3445] text-[#dde2f8]"
                  : "text-[#c3c6d7] hover:bg-white/5"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 w-full">
        {points.length > 0 ? (
          <svg
            className="h-full w-full overflow-visible"
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
            role="img"
            aria-label="Study time trend chart"
          >
            <defs>
              <linearGradient id="study-trend-gradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#b4c5ff" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#b4c5ff" stopOpacity="0" />
              </linearGradient>
            </defs>
            <polygon points={areaPoints} fill="url(#study-trend-gradient)" />
            <polyline
              points={linePoints}
              fill="none"
              stroke="#b4c5ff"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              vectorEffect="non-scaling-stroke"
            />
            {points.map((point) => (
              <circle key={point.label} cx={point.x} cy={point.y} fill="#b4c5ff" r="4" />
            ))}
          </svg>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[#c3c6d7]">
            Complete a study session to see your trend.
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-between px-2 text-[10px] font-semibold uppercase tracking-wider text-[#c3c6d7] sm:text-xs">
        {data.map((item) => (
          <span key={item.label}>{item.label}</span>
        ))}
      </div>
    </section>
  );
}

export default StudyTrendChart;
