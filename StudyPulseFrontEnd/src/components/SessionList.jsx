import { useMemo, useState } from "react";

const SUBJECTS = [
  "General",
  "DSA",
  "Java",
  "React",
  "Spring Boot",
  "AI",
  "Math",
  "Other",
];

function SessionList({
  sessionsByDate,
  formatTime,
  isLoading,
  hasAnyStudyData,
  onUpdateSession,
  onDeleteSession,
}) {
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [editSubject, setEditSubject] = useState("General");
  const [editDuration, setEditDuration] = useState("");

  const sessions = useMemo(() => {
    const allSessions = [];

    Object.entries(sessionsByDate || {}).forEach(([dateKey, daySessions]) => {
      (daySessions || []).forEach((session, index) => {
        allSessions.push({
          id: session?.id || `${dateKey}-${index}`,
          duration: Number(session?.duration) || 0,
          subject: session?.subject || "General",
          createdAt: session?.createdAt || `${dateKey}T00:00:00.000Z`,
          dateKey,
        });
      });
    });

    return allSessions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [sessionsByDate]);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const startEdit = (session) => {
    setEditingSessionId(session.id);
    setEditSubject(session.subject || "General");
    setEditDuration(String(session.duration || 0));
  };

  const cancelEdit = () => {
    setEditingSessionId(null);
    setEditSubject("General");
    setEditDuration("");
  };

  const saveEdit = (sessionId) => {
    const nextDuration = Number(editDuration);

    if (Number.isNaN(nextDuration) || nextDuration <= 0) {
      alert("Please enter a valid duration in seconds.");
      return;
    }

    onUpdateSession({
      sessionId,
      subject: editSubject,
      duration: nextDuration,
    });

    cancelEdit();
  };

  const deleteSession = (sessionId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this session?"
    );

    if (!confirmDelete) return;

    onDeleteSession(sessionId);

    if (editingSessionId === sessionId) {
      cancelEdit();
    }
  };

  if (isLoading) {
    return (
      <div className="panel session-panel">
        <div className="skeleton skeleton-text medium" />
        <div className="session-list">
          {[1, 2, 3, 4].map((item) => (
            <div className="skeleton skeleton-session-row" key={item} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="panel session-panel">
      <div className="panel-head">
        <p className="panel-title">Session List</p>
      </div>

      {!hasAnyStudyData ? (
        <div className="empty-state">
          <p className="empty-title">No sessions yet</p>
          <p className="empty-text">
            Start the timer, study for some time, then press Reset to save a session here.
          </p>
        </div>
      ) : sessions.length === 0 ? (
        <div className="empty-state">
          <p className="empty-title">No sessions match current filters</p>
          <p className="empty-text">
            Period ya subject filter change karke dekho.
          </p>
        </div>
      ) : (
        <div className="session-list">
          {sessions.map((session) => {
            const isEditing = editingSessionId === session.id;

            return (
              <div className="session-card" key={session.id}>
                {!isEditing ? (
                  <>
                    <div className="session-top">
                      <span className="session-subject">{session.subject}</span>
                      <span className="session-duration">
                        {formatTime(session.duration)}
                      </span>
                    </div>

                    <p className="session-date">{formatDate(session.createdAt)}</p>

                    <div className="session-actions">
                      <button
                        className="btn ghost small session-btn"
                        onClick={() => startEdit(session)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn secondary small session-btn danger"
                        onClick={() => deleteSession(session.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="session-edit">
                    <div className="session-edit-row">
                      <label className="edit-label">
                        Subject
                        <select
                          className="subject-select"
                          value={editSubject}
                          onChange={(e) => setEditSubject(e.target.value)}
                        >
                          {SUBJECTS.map((subject) => (
                            <option key={subject} value={subject}>
                              {subject}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="edit-label">
                        Duration (seconds)
                        <input
                          className="goal-input"
                          type="number"
                          min="1"
                          value={editDuration}
                          onChange={(e) => setEditDuration(e.target.value)}
                        />
                      </label>
                    </div>

                    <div className="session-actions">
                      <button
                        className="btn primary small session-btn"
                        onClick={() => saveEdit(session.id)}
                      >
                        Save
                      </button>
                      <button
                        className="btn ghost small session-btn"
                        onClick={cancelEdit}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SessionList;