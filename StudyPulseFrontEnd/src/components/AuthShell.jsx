function AuthShell({ title, subtitle, error, children, footer }) {
  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <p className="text-2xl font-bold tracking-tight text-[#b4c5ff]">
          StudyPulse
        </p>
        <p className="mt-1 text-sm text-[#8d90a0]">
          Track. Focus. Improve.
        </p>
      </div>

      <div className="glass-card rounded-2xl p-8 shadow-2xl shadow-black/20">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-[#dde2f8]">{title}</h1>
          {subtitle && (
            <p className="mt-2 text-sm leading-relaxed text-[#c3c6d7]">
              {subtitle}
            </p>
          )}
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-lg border border-[#ffb4ab]/30 bg-[#ffb4ab]/10 px-4 py-3 text-sm text-[#ffb4ab]"
          >
            {error}
          </div>
        )}

        {children}
      </div>

      {footer && (
        <p className="mt-6 text-center text-sm text-[#c3c6d7]">{footer}</p>
      )}
    </div>
  );
}

export default AuthShell;
