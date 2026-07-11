import { Link } from "react-router-dom";
import { formatGoalProgress } from "../utils/goalUtils";

function GoalsSnapshot({ goals = [], loading = false }) {
  const visibleGoals = goals.slice(0, 3);

  return (
    <section className="glass-card rounded-xl p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-[#dde2f8]">Your Goals</h2>
        <Link
          to="/goals"
          className="text-sm font-medium text-[#b4c5ff] transition hover:text-white"
        >
          View all
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-[#c3c6d7]">Loading goals...</p>
      ) : visibleGoals.length > 0 ? (
        <div className="space-y-4">
          {visibleGoals.map((goal) => {
            const percentage = Math.min(100, goal.percentage ?? 0);

            return (
              <div key={goal.id}>
                <div className="mb-1 flex items-center justify-between gap-2 text-sm">
                  <span className="truncate font-medium text-[#dde2f8]">
                    {goal.title}
                  </span>
                  <span className="shrink-0 text-[#b4c5ff]">{percentage}%</span>
                </div>
                <p className="mb-2 text-xs text-[#8d90a0]">
                  {formatGoalProgress(goal)}
                </p>
                <div className="h-2 rounded-full bg-[#20283a]">
                  <div
                    className="h-2 rounded-full bg-[#2563eb] transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-white/10 p-4 text-center">
          <p className="text-sm text-[#c3c6d7]">
            No goals yet. Create one to track your progress.
          </p>
          <Link
            to="/goals"
            className="mt-3 inline-block text-sm font-semibold text-[#b4c5ff]"
          >
            Set a goal
          </Link>
        </div>
      )}
    </section>
  );
}

export default GoalsSnapshot;
