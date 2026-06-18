function WeeklySummary({ data = [], weeklyGoal = 42 }) {
  const studiedHours = data.reduce((total, item) => total + Number(item.hours || 0), 0);
  const goalProgress = weeklyGoal > 0 ? Math.min((studiedHours / weeklyGoal) * 100, 100) : 0;

  return (
    <section className="glass-card flex h-full flex-col rounded-xl p-6">
      <h2 className="mb-6 text-2xl font-semibold text-[#dde2f8]">Weekly Progress</h2>

      <div className="flex-1 space-y-6">
        {data.length > 0 ? (
          data.map((item) => (
            <div key={item.day} className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-[#c3c6d7]">{item.day}</span>
                <span className="text-[#dde2f8]">
                  {item.hours || 0}h / {item.goal || 6}h
                </span>
              </div>
              <progress
                className="progress-bar block"
                value={item.hours || 0}
                max={item.goal || 6}
                aria-label={`${item.day} study progress`}
              />
            </div>
          ))
        ) : (
          <div className="space-y-5">
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
              <div key={day} className="space-y-2 opacity-60">
                <div className="flex justify-between text-sm">
                  <span className="text-[#c3c6d7]">{day}</span>
                  <span className="text-[#dde2f8]">0h / 6h</span>
                </div>
                <progress className="progress-bar block" value="0" max="6" />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 rounded-xl border border-[#b4c5ff]/10 bg-[#b4c5ff]/5 p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-[#b4c5ff]/20 p-2 text-[#b4c5ff]">
            <span className="material-symbols-outlined">insights</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#dde2f8]">Weekly Goal: {weeklyGoal}h</p>
            <p className="text-xs text-[#c3c6d7]">
              You are {Math.round(goalProgress)}% through your goal.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WeeklySummary;
