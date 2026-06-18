function DashboardCards({
  todayTime,
  weekTime,
  streak,
  totalSessions,
}) {
  const cards = [
    {
      label: "Today's Study",
      value: todayTime,
      icon: "schedule",
      note: "Today",
      accent: "text-[#b4c5ff] bg-[#b4c5ff]/10",
    },
    {
      label: "Weekly Study",
      value: weekTime,
      icon: "date_range",
      note: "Last 7 days",
      accent: "text-[#adc6ff] bg-[#0566d9]/10",
    },
    {
      label: "Current Streak",
      value: streak,
      icon: "local_fire_department",
      note: "Keep it up!",
      accent: "text-[#c0c1ff] bg-[#585be6]/10",
    },
    {
      label: "Total Sessions",
      value: totalSessions,
      icon: "analytics",
      note: "All time",
      accent: "text-[#8d90a0] bg-[#434655]/20",
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="glass-card flex min-h-36 flex-col justify-between rounded-xl p-4"
        >
          <div className="mb-4 flex items-start justify-between">
            <span className={`rounded-lg p-2 ${card.accent}`}>
              <span className={`material-symbols-outlined ${card.label === "Current Streak" ? "filled-icon" : ""}`}>
                {card.icon}
              </span>
            </span>
            <span className="text-xs font-semibold text-[#c3c6d7]">{card.note}</span>
          </div>
          <div>
            <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#c3c6d7]">
              {card.label}
            </h3>
            <p className="text-2xl font-semibold text-[#dde2f8]">{card.value}</p>
          </div>
        </div>
      ))}
    </section>
  );
}

export default DashboardCards;
