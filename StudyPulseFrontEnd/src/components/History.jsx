const getSessionKey = (session, index) => {
  return session.id ?? `${session.subjectName}-${session.startTime}-${index}`;
};

function History({ sessions = [], formatDuration, formatDate, formatTime }) {
  if (sessions.length === 0) {
    return (
      <section className="glass-card rounded-2xl border-dashed p-12 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#242a3a] text-[#c3c6d7]/40">
          <span className="material-symbols-outlined text-5xl">history</span>
        </div>
        <h2 className="mb-2 text-2xl font-semibold text-[#dde2f8]">No study sessions yet</h2>
        <p className="mx-auto max-w-md text-sm text-[#c3c6d7]">
          Start and complete a study session to see your learning timeline here.
        </p>
      </section>
    );
  }

  return (
    <section className="glass-card overflow-hidden rounded-2xl">
      <div className="border-b border-white/10 px-6 py-5">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-semibold text-[#dde2f8]">Session Timeline</h2>
            <p className="text-sm text-[#c3c6d7]">Latest study sessions appear first.</p>
          </div>
          <span className="rounded-full bg-[#b4c5ff]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#b4c5ff]">
            {sessions.length} Sessions
          </span>
        </div>
      </div>

      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead className="bg-[#151b2b]/80 text-xs uppercase tracking-wider text-[#c3c6d7]">
            <tr>
              <th className="px-6 py-4 font-semibold">Subject Name</th>
              <th className="px-6 py-4 font-semibold">Duration</th>
              <th className="px-6 py-4 font-semibold">Start Time</th>
              <th className="px-6 py-4 font-semibold">End Time</th>
              <th className="px-6 py-4 font-semibold">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sessions.map((session, index) => (
              <tr key={getSessionKey(session, index)} className="transition hover:bg-white/[0.03]">
                <td className="px-6 py-5">
                  <span className="inline-flex rounded-full bg-[#b4c5ff]/10 px-3 py-1 text-sm font-semibold text-[#b4c5ff]">
                    {session.subjectName}
                  </span>
                </td>
                <td className="px-6 py-5 font-mono text-sm text-[#dde2f8]">
                  {formatDuration(session.durationSeconds)}
                </td>
                <td className="px-6 py-5 text-sm text-[#dde2f8]">{formatTime(session.startTime)}</td>
                <td className="px-6 py-5 text-sm text-[#dde2f8]">{formatTime(session.endTime)}</td>
                <td className="px-6 py-5 text-sm text-[#c3c6d7]">{formatDate(session.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 p-4 lg:hidden">
        {sessions.map((session, index) => (
          <article
            key={getSessionKey(session, index)}
            className="rounded-xl border border-white/5 bg-[#151b2b]/70 p-4"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex rounded-full bg-[#b4c5ff]/10 px-3 py-1 text-sm font-semibold text-[#b4c5ff]">
                  {session.subjectName}
                </span>
                <p className="mt-2 text-xs uppercase tracking-wider text-[#c3c6d7]">
                  {formatDate(session.date)}
                </p>
              </div>
              <span className="font-mono text-sm font-semibold text-[#dde2f8]">
                {formatDuration(session.durationSeconds)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-[#0d1322]/70 p-3">
                <p className="mb-1 text-xs uppercase tracking-wider text-[#c3c6d7]">Start Time</p>
                <p className="text-[#dde2f8]">{formatTime(session.startTime)}</p>
              </div>
              <div className="rounded-lg bg-[#0d1322]/70 p-3">
                <p className="mb-1 text-xs uppercase tracking-wider text-[#c3c6d7]">End Time</p>
                <p className="text-[#dde2f8]">{formatTime(session.endTime)}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default History;
