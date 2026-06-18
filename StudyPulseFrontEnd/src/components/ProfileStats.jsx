function ProfileStats({ totalSessions, totalStudyTime }) {
  const stats = [
    {
      label: "Total Sessions",
      value: totalSessions,
      icon: "history",
      helper: "Completed focus sessions",
      accent: "bg-[#b4c5ff]/10 text-[#b4c5ff]",
    },
    {
      label: "Total Study Time",
      value: totalStudyTime,
      icon: "timer",
      helper: "Across all recorded sessions",
      accent: "bg-[#0566d9]/20 text-[#adc6ff]",
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {stats.map((stat) => (
        <article key={stat.label} className="glass-card rounded-2xl p-6">
          <div className="mb-6 flex items-start justify-between">
            <span className={`rounded-xl p-3 ${stat.accent}`}>
              <span className="material-symbols-outlined">{stat.icon}</span>
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#c3c6d7]">
              All time
            </span>
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#c3c6d7]">
            {stat.label}
          </p>
          <p className="mt-2 text-3xl font-semibold text-[#dde2f8]">{stat.value}</p>
          <p className="mt-3 text-sm text-[#c3c6d7]">{stat.helper}</p>
        </article>
      ))}
    </section>
  );
}

export default ProfileStats;
