const colors = ["#b4c5ff", "#adc6ff", "#c0c1ff", "#2563eb", "#8d90a0"];

function SubjectPieChart({ data = [] }) {
  const segments = data.reduce(
    (result, item, index) => {
      const previous = result[index - 1];
      const offset = previous ? previous.offset + previous.percentage : 0;
      return [...result, { ...item, color: colors[index % colors.length], offset }];
    },
    []
  );

  return (
    <section className="glass-card rounded-xl p-6 lg:col-span-4">
      <h2 className="mb-12 text-2xl font-semibold text-[#dde2f8]">Subject Distribution</h2>

      <div className="relative mx-auto mb-6 h-48 w-48">
        <svg
          className="h-full w-full -rotate-90"
          viewBox="0 0 36 36"
          role="img"
          aria-label="Subject study time distribution"
        >
          <circle cx="18" cy="18" fill="none" r="16" stroke="#2f3445" strokeWidth="3" />
          {segments.map((segment) => (
            <circle
              key={segment.subject}
              cx="18"
              cy="18"
              fill="none"
              r="16"
              stroke={segment.color}
              strokeDasharray={`${segment.percentage}, 100`}
              strokeDashoffset={-segment.offset}
              strokeWidth="3"
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm text-[#c3c6d7]">Top</span>
          <span className="max-w-28 truncate text-xl font-semibold text-[#dde2f8]">
            {segments[0]?.subject || "No data"}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {segments.length > 0 ? (
          segments.slice(0, 5).map((segment) => (
            <div key={segment.subject} className="flex items-center justify-between">
              <div className="flex min-w-0 items-center gap-2">
                <svg className="h-3 w-3 shrink-0" viewBox="0 0 12 12" aria-hidden="true">
                  <circle cx="6" cy="6" r="6" fill={segment.color} />
                </svg>
                <span className="truncate text-sm text-[#dde2f8]">{segment.subject}</span>
              </div>
              <span className="font-mono text-sm text-[#dde2f8]">
                {Math.round(segment.percentage)}%
              </span>
            </div>
          ))
        ) : (
          <p className="text-center text-sm text-[#c3c6d7]">No subject data yet.</p>
        )}
      </div>
    </section>
  );
}

export default SubjectPieChart;
