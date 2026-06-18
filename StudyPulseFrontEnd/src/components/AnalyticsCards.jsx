function AnalyticsCards({
  mostStudiedSubject = "No data",
  mostStudiedPercent = 0,
  averageDailyTime = "0h 0m",
  totalHours = "0 hrs",
  longestSession = "0h 0m",
}) {
  const cards = [
    {
      label: "Most Studied Subject",
      value: mostStudiedSubject,
      icon: "psychology",
      note: `${Math.round(mostStudiedPercent)}%`,
      iconClass: "bg-[#2563eb]/20 text-[#b4c5ff]",
      footer: (
        <progress
          className="progress-bar mt-4 block h-1"
          value={mostStudiedPercent}
          max="100"
          aria-label="Most studied subject percentage"
        />
      ),
    },
    {
      label: "Avg Daily Time",
      value: averageDailyTime,
      icon: "timer",
      note: "Past 7 days",
      iconClass: "bg-[#0566d9]/20 text-[#adc6ff]",
      footer: <p className="mt-4 text-sm text-[#c3c6d7]">Based on completed sessions</p>,
    },
    {
      label: "Total Hours",
      value: totalHours,
      icon: "equalizer",
      note: "Month",
      iconClass: "bg-[#585be6]/20 text-[#c0c1ff]",
      footer: <p className="mt-4 text-sm text-[#c3c6d7]">Current calendar month</p>,
    },
    {
      label: "Longest Session",
      value: longestSession,
      icon: "rocket_launch",
      note: "Best",
      iconClass: "bg-[#2563eb]/20 text-[#b4c5ff]",
      footer: <p className="mt-4 text-sm font-medium text-[#b4c5ff]">Personal record</p>,
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <article
          key={card.label}
          className="glass-card flex min-h-44 flex-col justify-between rounded-xl p-4"
        >
          <div className="mb-2 flex items-start justify-between">
            <span className={`rounded-lg p-2 ${card.iconClass}`}>
              <span className="material-symbols-outlined">{card.icon}</span>
            </span>
            <span className="rounded-full bg-[#b4c5ff]/10 px-2 py-0.5 text-xs font-semibold text-[#c3c6d7]">
              {card.note}
            </span>
          </div>
          <div>
            <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#c3c6d7]">
              {card.label}
            </h3>
            <p className="truncate text-2xl font-semibold text-[#dde2f8]" title={card.value}>
              {card.value}
            </p>
          </div>
          {card.footer}
        </article>
      ))}
    </section>
  );
}

export default AnalyticsCards;
