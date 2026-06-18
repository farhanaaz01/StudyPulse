import GoalCard from "../components/GoalCard";

const defaultGoals = [
  {
    id: "daily-focus",
    period: "Daily",
    title: "Focus Sessions",
    description: "Complete 6 Pomodoro sessions",
    value: 4.5,
    max: 6,
    progressLabel: "4/6 Sessions",
    statusLabel: "2 to go",
    accent: "primary",
  },
  {
    id: "weekly-hours",
    period: "Weekly",
    title: "Deep Work Hours",
    description: "Total 25 hours intensive study",
    value: 10.5,
    max: 25,
    progressLabel: "10.5/25 Hours",
    statusLabel: "Progressing",
    accent: "secondary",
  },
  {
    id: "monthly-course",
    period: "Monthly",
    title: "Course Completion",
    description: "Advanced Quantum Physics",
    value: 18,
    max: 20,
    progressLabel: "18/20 Modules",
    statusLabel: "Near Finish",
    accent: "tertiary",
  },
];

const defaultAchievements = [
  {
    id: "three-day",
    title: "3 Day Streak",
    description: "Consistency Starter",
    icon: "local_fire_department",
    iconClass: "bg-[#b4c5ff]/10 text-[#b4c5ff]",
  },
  {
    id: "seven-day",
    title: "7 Day Streak",
    description: "The Momentum King",
    icon: "bolt",
    iconClass: "bg-[#0566d9]/20 text-[#adc6ff]",
  },
  {
    id: "thirty-day",
    title: "30 Day Streak",
    description: "Master of Habits",
    icon: "workspace_premium",
    iconClass: "bg-[#585be6]/20 text-[#c0c1ff]",
  },
  {
    id: "study-warrior",
    title: "Study Warrior",
    description: "500+ Hours Logged",
    icon: "swords",
    iconClass: "bg-[#2563eb]/20 text-[#b4c5ff]",
  },
];

function Goals({
  goals = defaultGoals,
  achievements = defaultAchievements,
  onNewGoal,
  onCreateMilestone,
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <section className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h1 className="mb-1 text-3xl font-semibold text-[#dde2f8]">Study Goals</h1>
          <p className="text-[#c3c6d7]">Precision tracking for your academic excellence.</p>
        </div>
        <button
          type="button"
          onClick={onNewGoal}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#2563eb] px-6 py-2 font-semibold text-[#eeefff] shadow-lg transition hover:bg-[#2563eb]/90 active:scale-95"
        >
          <span className="material-symbols-outlined">add</span>
          New Goal
        </button>
      </section>

      <section className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {goals.map((goal) => (
          <GoalCard key={goal.id || goal.title} {...goal} />
        ))}
      </section>

      <section className="mb-12">
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold text-[#dde2f8]">
          <span className="material-symbols-outlined text-[#b4c5ff]">military_tech</span>
          Achievement Badges
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {achievements.map((achievement) => (
            <article
              key={achievement.id || achievement.title}
              className="glass-card group flex flex-col items-center rounded-2xl p-6 text-center"
            >
              <div
                className={`mb-4 flex h-20 w-20 items-center justify-center rounded-full transition duration-300 group-hover:scale-110 ${achievement.iconClass}`}
              >
                <span className="material-symbols-outlined filled-icon text-4xl">
                  {achievement.icon}
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#dde2f8]">{achievement.title}</h3>
              <p className="text-sm text-[#c3c6d7]">{achievement.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12 flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 px-6 py-16 text-center sm:p-20">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#242a3a] text-[#c3c6d7]/30">
          <span className="material-symbols-outlined text-6xl">target</span>
        </div>
        <h2 className="mb-2 text-2xl font-semibold text-[#dde2f8]">No Pending Custom Goals</h2>
        <p className="mx-auto mb-6 max-w-md text-[#c3c6d7]">
          You&apos;ve completed your custom targets. Set a new milestone to challenge your
          academic limits and track your ascent.
        </p>
        <button
          type="button"
          onClick={onCreateMilestone}
          className="flex items-center gap-1 text-[#b4c5ff] transition hover:underline"
        >
          <span className="material-symbols-outlined text-base">add_circle</span>
          Create custom milestone
        </button>
      </section>
    </div>
  );
}

export default Goals;
