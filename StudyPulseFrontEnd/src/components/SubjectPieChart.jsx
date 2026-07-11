const colors = ["#b4c5ff", "#adc6ff", "#c0c1ff", "#2563eb", "#8d90a0", "#585be6"];

const CX = 18;
const CY = 18;
const RADIUS = 16;

function buildSlicePath(startPercent, endPercent) {
  const span = endPercent - startPercent;

  if (span <= 0) return null;

  // Full circle slice (single subject at ~100%)
  if (span >= 0.999) {
    return `M ${CX} ${CY} m -${RADIUS}, 0 a ${RADIUS},${RADIUS} 0 1,0 ${
      RADIUS * 2
    },0 a ${RADIUS},${RADIUS} 0 1,0 -${RADIUS * 2},0`;
  }

  const startAngle = startPercent * 2 * Math.PI - Math.PI / 2;
  const endAngle = endPercent * 2 * Math.PI - Math.PI / 2;

  const x1 = CX + RADIUS * Math.cos(startAngle);
  const y1 = CY + RADIUS * Math.sin(startAngle);
  const x2 = CX + RADIUS * Math.cos(endAngle);
  const y2 = CY + RADIUS * Math.sin(endAngle);

  const largeArc = span > 0.5 ? 1 : 0;

  return `M ${CX} ${CY} L ${x1} ${y1} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${x2} ${y2} Z`;
}

function buildSegments(data) {
  let cumulative = 0;

  return data.map((item, index) => {
    const start = cumulative;
    cumulative += item.percentage / 100;
    const end = cumulative;

    return {
      ...item,
      color: colors[index % colors.length],
      path: buildSlicePath(start, end),
    };
  });
}

function SubjectPieChart({ data = [] }) {
  const segments = buildSegments(data);
  const topSubject = segments[0]?.subject || "No data";

  return (
    <section className="glass-card rounded-xl p-6 lg:col-span-4">
      <h2 className="mb-12 text-2xl font-semibold text-[#dde2f8]">
        Subject Distribution
      </h2>

      <div className="relative mx-auto mb-6 h-48 w-48">
        <svg
          className="h-full w-full"
          viewBox="0 0 36 36"
          role="img"
          aria-label="Subject study time distribution"
        >
          <circle cx={CX} cy={CY} r={RADIUS} fill="#2f3445" />

          {segments.map((segment) =>
            segment.path ? (
              <path
                key={segment.subject}
                d={segment.path}
                fill={segment.color}
                stroke="#191f2f"
                strokeWidth="0.4"
              />
            ) : null
          )}

          {/* Donut hole */}
          <circle cx={CX} cy={CY} r="9" fill="#191f2f" />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm text-[#c3c6d7]">Top</span>
          <span className="max-w-28 truncate text-xl font-semibold text-[#dde2f8]">
            {topSubject}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {segments.length > 0 ? (
          segments.map((segment) => (
            <div key={segment.subject} className="flex items-center justify-between">
              <div className="flex min-w-0 items-center gap-2">
                <svg className="h-3 w-3 shrink-0" viewBox="0 0 12 12" aria-hidden="true">
                  <circle cx="6" cy="6" r="6" fill={segment.color} />
                </svg>
                <span className="truncate text-sm text-[#dde2f8]">
                  {segment.subject}
                </span>
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
