import { formatGoalTime } from "../utils/goalUtils";

function WeeklySummary({ data = [], weeklyGoalSeconds = null }) {
  const studiedSeconds = data.reduce(
    (total, item) => total + (item.seconds || 0),
    0
  );

  const formatTime = (seconds = 0) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };

  const goalProgress =
    weeklyGoalSeconds && weeklyGoalSeconds > 0
      ? Math.min((studiedSeconds / weeklyGoalSeconds) * 100, 100)
      : 0;

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
                  {formatTime(item.seconds || 0)}
                </span>
              </div>
              <progress
                className="progress-bar block"
                value={item.seconds || 0}
                max={21600}
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
                  <span className="text-[#dde2f8]">00:00:00</span>
                </div>
                <progress className="progress-bar block" value="0" max="6" />
              </div>
            ))}
          </div>
        )}
      </div>

      {weeklyGoalSeconds ? (
        <div className="mt-8 rounded-xl border border-[#b4c5ff]/10 bg-[#b4c5ff]/5 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-[#b4c5ff]/20 p-2 text-[#b4c5ff]">
              <span className="material-symbols-outlined">insights</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#dde2f8]">
                Weekly Goal: {formatGoalTime(weeklyGoalSeconds)}
              </p>
              <p className="text-xs text-[#c3c6d7]">
                You are {Math.round(goalProgress)}% through your goal.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default WeeklySummary;
