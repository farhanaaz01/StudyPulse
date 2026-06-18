function ProfileSummary({ name, email, joinedDate, isFallback }) {
  const initials = (name || "Student")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <section className="glass-card overflow-hidden rounded-2xl">
      <div className="relative border-b border-white/10 p-6 sm:p-8">
        <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-[#b4c5ff]/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl border border-[#b4c5ff]/20 bg-[#242a3a] text-3xl font-bold text-[#b4c5ff] shadow-lg shadow-blue-950/20">
            {initials}
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <h1 className="truncate text-3xl font-semibold text-[#dde2f8]">{name}</h1>
              {isFallback && (
                <span className="rounded-full bg-[#ffb4ab]/10 px-3 py-1 text-xs font-semibold text-[#ffb4ab]">
                  Temporary Data
                </span>
              )}
            </div>
            <p className="text-sm text-[#c3c6d7]">{email}</p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#151b2b] px-4 py-2 text-sm text-[#c3c6d7]">
              <span className="material-symbols-outlined text-base text-[#b4c5ff]">calendar_today</span>
              Joined {joinedDate}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProfileSummary;
