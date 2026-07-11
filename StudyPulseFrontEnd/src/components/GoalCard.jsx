import { formatGoalProgress } from "../utils/goalUtils";

function GoalCard({ goal, onDelete }) {
  const percentage = Math.min(100, goal.percentage ?? 0);

  return (
    <div className="glass-card rounded-xl border border-white/10 p-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-md bg-[#2563eb]/20 px-3 py-1 text-xs font-semibold text-[#b4c5ff]">
          {goal.type}
        </span>

        <button
          type="button"
          onClick={() => onDelete(goal.id)}
          className="text-red-400 hover:text-red-300"
        >
          Delete
        </button>
      </div>

      <h2 className="mb-3 text-xl font-semibold text-[#dde2f8]">{goal.title}</h2>

      {goal.subjectName && (
        <p className="mb-3 text-sm text-[#c3c6d7]">Subject: {goal.subjectName}</p>
      )}

      <p className="text-sm text-[#c3c6d7]">
        Progress: {formatGoalProgress(goal)}
      </p>

      <div className="mt-4 h-3 rounded-full bg-[#20283a]">
        <div
          className="h-3 rounded-full bg-[#2563eb] transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="mt-3 text-right text-sm text-[#b4c5ff]">
        {percentage}% Complete
      </p>
    </div>
  );
}

export default GoalCard;
