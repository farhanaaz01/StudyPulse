import { useCallback, useEffect, useState } from "react";
import GoalCard from "../components/GoalCard";
import { getGoalsApi, deleteGoalApi, createGoalApi } from "../api/goalApi";
import { getApiErrorMessage } from "../utils/apiError";
import {
  formatGoalProgress,
  getGoalByType,
  getGoalSummaryLabel,
} from "../utils/goalUtils";

function SummaryCard({ label, goal, loading }) {
  return (
    <div className="glass-card rounded-xl p-5">
      <p className="text-sm text-[#c3c6d7]">{label}</p>
      {loading ? (
        <h2 className="mt-2 text-2xl font-bold text-white">...</h2>
      ) : goal ? (
        <>
          <h2 className="mt-2 text-2xl font-bold text-white">
            {formatGoalProgress(goal)}
          </h2>
          <p className="mt-1 text-sm text-[#b4c5ff]">
            {getGoalSummaryLabel(goal)}
          </p>
        </>
      ) : (
        <>
          <h2 className="mt-2 text-lg font-semibold text-[#8d90a0]">
            Not set
          </h2>
          <p className="mt-1 text-sm text-[#c3c6d7]">
            Create a {label.toLowerCase()} to track progress
          </p>
        </>
      )}
    </div>
  );
}

function Goals() {
  const [showModal, setShowModal] = useState(false);
  const [goals, setGoals] = useState([]);
  const [type, setType] = useState("WEEKLY");
  const [targetValue, setTargetValue] = useState("");
  const [targetUnit, setTargetUnit] = useState("HOURS");
  const [subjectName, setSubjectName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saveError, setSaveError] = useState("");

  const fetchGoals = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getGoalsApi();
      setGoals(response.data);
    } catch (err) {
      console.error(err);
      setError(getApiErrorMessage(err, "Unable to load goals."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const handleCreateGoal = async () => {
    if (!targetValue || Number(targetValue) <= 0) {
      setSaveError("Enter a target value greater than 0.");
      return;
    }

    if (type === "SUBJECT" && !subjectName.trim()) {
      setSaveError("Enter a subject name for this goal.");
      return;
    }

    setSaveError("");

    try {
      const goal = {
        title:
          type === "WEEKLY"
            ? "Weekly Study Goal"
            : type === "SUBJECT"
              ? "Subject Goal"
              : "Study Streak Goal",
        type,
        targetValue: Number(targetValue),
        targetUnit: type === "STREAK" ? "DAYS" : targetUnit,
        subjectName: type === "SUBJECT" ? subjectName.trim() : "",
      };

      await createGoalApi(goal);
      setShowModal(false);
      setType("WEEKLY");
      setTargetValue("");
      setTargetUnit("HOURS");
      setSubjectName("");
      await fetchGoals();
    } catch (err) {
      console.error(err);
      setSaveError(getApiErrorMessage(err, "Unable to create goal."));
    }
  };

  const handleDeleteGoal = async (id) => {
    try {
      await deleteGoalApi(id);
      await fetchGoals();
    } catch (err) {
      console.error(err);
      setError(getApiErrorMessage(err, "Unable to delete goal."));
    }
  };

  const weeklyGoal = getGoalByType(goals, "WEEKLY");
  const subjectGoal = getGoalByType(goals, "SUBJECT");
  const streakGoal = getGoalByType(goals, "STREAK");

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#dde2f8]">Study Goals</h1>
          <p className="text-[#c3c6d7]">
            Track and manage your learning targets
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setSaveError("");
            setShowModal(true);
          }}
          className="rounded-lg bg-[#2563eb] px-5 py-2 font-semibold text-white"
        >
          + New Goal
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-[#ffb4ab]/30 bg-[#ffb4ab]/10 px-4 py-3 text-sm text-[#ffb4ab]"
        >
          {error}
        </div>
      )}

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <SummaryCard label="Weekly Goal" goal={weeklyGoal} loading={loading} />
        <SummaryCard label="Subject Goal" goal={subjectGoal} loading={loading} />
        <SummaryCard label="Study Streak" goal={streakGoal} loading={loading} />
      </div>

      {loading ? (
        <p className="text-sm text-[#c3c6d7]">Loading goals...</p>
      ) : goals.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-3">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} onDelete={handleDeleteGoal} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-white/10 p-10 text-center">
          <p className="text-[#c3c6d7]">
            No goals yet. Create your first goal to start tracking progress.
          </p>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md rounded-xl bg-[#151b2b] p-6">
            <h2 className="mb-5 text-xl font-semibold text-white">Create Goal</h2>

            {saveError && (
              <p className="mb-4 rounded-lg border border-[#ffb4ab]/30 bg-[#ffb4ab]/10 px-3 py-2 text-sm text-[#ffb4ab]">
                {saveError}
              </p>
            )}

            <div className="mb-4">
              <label className="mb-2 block text-sm text-[#c3c6d7]">Goal Type</label>
              <select
                value={type}
                onChange={(e) => {
                  const nextType = e.target.value;
                  setType(nextType);
                  setTargetUnit(nextType === "STREAK" ? "DAYS" : "HOURS");
                }}
                className="w-full rounded-lg border border-white/10 bg-[#0d1322] p-3 text-white"
              >
                <option value="WEEKLY">Weekly Study Goal</option>
                <option value="SUBJECT">Subject Goal (this week)</option>
                <option value="STREAK">Study Streak Goal (days)</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-sm text-[#c3c6d7]">
                Target Value
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#0d1322] p-3 text-white"
                />
                {type !== "STREAK" && (
                  <select
                    value={targetUnit}
                    onChange={(e) => setTargetUnit(e.target.value)}
                    className="rounded-lg border border-white/10 bg-[#0d1322] px-3 py-3 text-white"
                  >
                    <option value="HOURS">Hours</option>
                    <option value="MINUTES">Minutes</option>
                  </select>
                )}
                {type === "STREAK" && (
                  <span className="flex items-center rounded-lg border border-white/10 bg-[#0d1322] px-4 text-sm text-[#c3c6d7]">
                    Days
                  </span>
                )}
              </div>
            </div>

            {type === "SUBJECT" && (
              <div className="mb-5">
                <label className="mb-2 block text-sm text-[#c3c6d7]">
                  Subject Name
                </label>
                <input
                  type="text"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  placeholder="Java"
                  className="w-full rounded-lg border border-white/10 bg-[#0d1322] p-3 text-white"
                />
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setSaveError("");
                }}
                className="rounded-lg border border-white/10 px-4 py-2 text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateGoal}
                className="rounded-lg bg-[#2563eb] px-4 py-2 font-semibold text-white"
              >
                Save Goal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Goals;
