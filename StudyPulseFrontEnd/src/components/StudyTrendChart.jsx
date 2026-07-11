function DailyLineChart({ data, maxValue }) {
  const width = 800;
  const height = 240;
  const padding = 20;
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
    <>
      <svg
        className="h-full w-full overflow-visible"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        role="img"
        aria-label="Daily study time trend"
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

      <div className="mt-4 flex justify-between px-2 text-xs font-semibold uppercase tracking-wider text-[#c3c6d7]">
        {data.map((item) => (
          <span key={item.label}>{item.shortLabel ?? item.label}</span>
        ))}
      </div>
    </>
  );
}

function WeeklyBarChart({ data, maxValue }) {
  return (
    <>
      <div className="flex h-56 items-end justify-center gap-4 px-2 sm:gap-6 sm:px-4">
        {data.map((item) => {
          const heightPercent =
            maxValue > 0 ? Math.max((item.hours / maxValue) * 100, 4) : 4;

          return (
            <div
              key={item.label}
              className="flex min-w-0 flex-1 max-w-24 flex-col items-center gap-2"
              title={`${item.fullLabel ?? item.label}: ${item.hours} hrs`}
            >
              <span className="text-xs font-semibold text-[#b4c5ff]">
                {item.hours}h
              </span>
              <div className="flex h-40 w-full items-end">
                <div
                  className="w-full rounded-t-xl bg-[#b4c5ff] transition hover:bg-[#2563eb]"
                  style={{ height: `${heightPercent}%` }}
                />
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-[#dde2f8]">
                  {item.shortLabel ?? item.label}
                </p>
                <p className="mt-0.5 text-[10px] leading-tight text-[#8d90a0]">
                  {item.fullLabel}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function StudyTrendChart({
  data = [],
  period = "week",
  trendType = "daily-line",
  onPeriodChange,
}) {
  const maxValue = Math.max(...data.map((item) => item.hours), 0.1);
  const isMonthly = period === "month" || trendType === "weekly-bars";

  const title = isMonthly ? "Monthly Study Trend" : "Weekly Study Trend";
  const subtitle = isMonthly
    ? "Total hours studied each week (last 30 days)"
    : "Hours focused per day over the last 7 days";

  return (
    <section className="glass-card overflow-hidden rounded-xl p-6 lg:col-span-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-[#dde2f8]">{title}</h2>
          <p className="text-sm text-[#c3c6d7]">{subtitle}</p>
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

      <div className="w-full">
        {data.length > 0 && data.some((item) => item.hours > 0) ? (
          isMonthly ? (
            <WeeklyBarChart data={data} maxValue={maxValue} />
          ) : (
            <div className="h-64">
              <DailyLineChart data={data} maxValue={maxValue} />
            </div>
          )
        ) : (
          <div className="flex h-64 items-center justify-center text-sm text-[#c3c6d7]">
            Complete a study session to see your trend.
          </div>
        )}
      </div>
    </section>
  );
}

export default StudyTrendChart;
